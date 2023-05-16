import { FC, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// API
import CALCULATE_SERVICE from "service/calculateService";

// Util
import Utils from "utils/Utils";

// Date
import { format, lastDayOfMonth, subMonths } from "date-fns";

// Type
import { SearchInfoSelectType } from "types/etc/etcType";

// Component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import NoData from "pages/common/noData";
import CalculateDetailTableBottom from "../component/CalculateDetailTableBottom";
import CalculateTableHeader from "../component/CalculateTableHeader";
import CalculateDetailTableTop from "../component/CalculateDetailTableTop";

interface CalculateCouponDetailTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const CalculateCouponDetailTable: FC<CalculateCouponDetailTableProps> = ({ userInfo }) => {
    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // 쿠폰 종류
    const [couponType, setCouponType] = useState<CouponType>({
        // { {key: CouponType}: {title: string, value: CouponType} }
        [COUPON_TYPE.ALL]: COUPON_TYPE_OPTION[COUPON_TYPE.ALL], // 0: { title: '쿠폰 전체', value: 0 },
    });

    // 검색 조건
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-01');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');

    const [searchCondition, setSearchCondition] = useState<SearchInfoSelectType>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchOption: [couponType[COUPON_TYPE.ALL], DEVICE_TYPE_OPTION[DEVICE_TYPE.ALL]], // 필터링 옵션
    });

    // 조회 Trigger
    const [queryTriggerDate, setQueryTriggerDate] = useState({
        queryFromDate: searchCondition.from,
        queryToDate: searchCondition.to,
    });

    // 테이블 상단 정보
    const [tableTopInfo, setTableTopInfo] = useState<TableTopInfo>({
        titleFrom: fromDate,
        titleTo: toDate,
        totalInfo: {},
    });

    const { data: calculateCouponList } = CALCULATE_SERVICE.useCalculateCouponList(f_code, staff_no);

    useEffect(() => {
        if (calculateCouponList) {
            // initialTotalInfo - { {key: CouponType}: {title: string, sum: number} }
            const [couponObj, initialTotalInfo] = calculateCouponList.reduce((res, cur, index) => {
                const codeName = cur.code_name;
                const code = cur.code;
                
                COUPON_TYPE[code] = index + 1
                
                res[0][index + 1] = { title: codeName, value: index + 1 }; // couponObj
                res[1][index + 1] = { title: codeName, sum: 0 }; // initialTotalInfo

                return res;
            }, [{}, {}] as [CouponType, TotalInfo]);

            initialTotalInfo[COUPON_TYPE.ALL] = { title: COUPON_TYPE_OPTION[COUPON_TYPE.ALL].title, sum: 0 };

            setCouponType(prev => ({ ...prev, ...couponObj }));
            setTableTopInfo(prev => ({ ...prev, totalInfo: initialTotalInfo }));
        };
    }, [calculateCouponList]);

    // 테이블 상단 검색영역 파라미터
    const calanderSearchOption = useMemo(() => ({
        title: '상세내역',
        dateType: 'yyyy-MM-dd',
        optionType: 'SELECT' as const,
        selectOption: [couponType, DEVICE_TYPE_OPTION], // select로 나타날 옵션 정보
        optionList: [Object.keys(couponType), Object.keys(DEVICE_TYPE_OPTION)], // option 맵핑할 때 사용  
        handleSearch: () => setQueryTriggerDate(prev => ({ queryFromDate: searchCondition.from, queryToDate: searchCondition.to, })),
    }), [setQueryTriggerDate, couponType, searchCondition]);

    // 페이지네이션 정보
    const [pageInfo, setPageInfo] = useState({
        dataCnt: 0,
        currentPage: 1,
        row: 20,
    });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null); // 엑셀 다운에 사용

    return (
        <>
            <CalculateDetailTableTop calanderSearchOption={calanderSearchOption} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} totalInfo={tableTopInfo.totalInfo} searchCondition={searchCondition} setSearchCondition={setSearchCondition} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <CalculateTableHeader width={width} thInfo={thInfo} tdInfo={tdInfo} />
                <tbody>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail', e)}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                            <TableList couponType={couponType} fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} queryTriggerDate={queryTriggerDate} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={'본사 쿠폰 결제내역'} />
        </>
    );
}

export default CalculateCouponDetailTable;




interface TableListProps {
    couponType: CouponType,
    fCode: number,
    staffNo: number,
    searchCondition: SearchInfoSelectType,
    queryTriggerDate: {
        queryFromDate: string;
        queryToDate: string;
    },
    setTableTopInfo: React.Dispatch<React.SetStateAction<TableTopInfo>>,
    pageInfo: {
        dataCnt: number;
        currentPage: number;
        row: number;
    },
    setPageInfo: React.Dispatch<React.SetStateAction<{
        dataCnt: number;
        currentPage: number;
        row: number;
    }>>,
};
const TableList: FC<TableListProps> = ({ couponType, fCode, staffNo, searchCondition, queryTriggerDate, setTableTopInfo, pageInfo, setPageInfo }) => {

    const { currentPage, row } = pageInfo;
    const { searchOption } = searchCondition;
    const { queryFromDate, queryToDate } = queryTriggerDate;

    const { data: couponDetailList } = CALCULATE_SERVICE.useCalculateCouponDetailList(fCode, staffNo, queryFromDate, queryToDate);

    // Table render Node 필터링, 쿠폰 사용금액 합계 계산
    const [renderTableList, totalInfoRes = {}] = useMemo(() => {

        // 쿠폰 종류 데이터 fetched 안됐을 때
        if (Object.values(couponType).length < 2) return [];

        // 쿠폰 합계 객체 생성
        const totalObj = Object.values(couponType).reduce((arr, cur) => {
            if (cur.value !== 0) arr[cur.value] = { title: cur.title, sum: 0 };
            return arr;
        }, {} as TotalInfo);

        // 쿠폰 사용 전체 금액 합계 렌더링할 때 맨 아래 위치시키기 위해서 999 키값 사용
        totalObj[999] = { title: COUPON_TOTAL_TITLE[COUPON_TYPE.ALL], sum: 0 };

        // 필터링 된 Table List 생성
        const tableList = couponDetailList?.reduce((arr, couponDetail, index) => {

            const { rcp_date, item_type, item_type_code, sItem, total_amt, rcp_type, phone, supply_amt, vat_amt } = couponDetail;
            const [date] = rcp_date.split(' '); // [date, time]

            // 합계 계산
            totalObj[COUPON_TYPE[item_type_code]].sum += total_amt;
            totalObj[999].sum += total_amt;

            // 필터링 조건
            const showCoupon = Number(searchOption[0].value);
            const isCouponType = showCoupon === couponType[COUPON_TYPE.ALL].value || showCoupon === item_type_code;
            const isDeviceType = searchOption[1].value === DEVICE_TYPE_OPTION[DEVICE_TYPE.ALL].value || searchOption[1].value === rcp_type;

            if (isCouponType && isDeviceType) {
                arr.push(
                    <>
                        <td className="align-center">{date}</td>
                        <td className="align-left">{item_type}</td>
                        <td className="align-center">{sItem}</td>
                        <td className="align-right">{Utils.numberComma(total_amt)}</td>
                        <td className="align-center">{rcp_type}</td>
                        <td className="align-center">{phone}</td>
                        <td className="align-right">{Utils.numberComma(supply_amt)}</td>
                        <td className="align-right">{Utils.numberComma(vat_amt)}</td>
                        <td className="align-right">{Utils.numberComma(total_amt)}</td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        return [tableList, totalObj];
    }, [couponDetailList, searchOption, couponType]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, titleFrom: queryFromDate, titleTo: queryToDate, totalInfo: totalInfoRes }));
    }, [setTableTopInfo, renderTableList, totalInfoRes, queryFromDate, queryToDate]);

    return (
        <>
            {/* 페이지네이션 적용 */}
            {renderTableList?.map((item, index) => {
                const isCurrentPage = (index >= (currentPage - 1) * row && index < currentPage * row);
                return (<tr key={index} style={{ display: isCurrentPage ? '' : 'none' }}>{item}</tr>);
            })}
            {renderTableList?.length === 0 && <NoData isTable={true} />}
        </>
    )
};

// Component Type
const TABLE_COLUMN_INFO = {
    width: ['188', '393', '262', '116', '134', '136', '136', '136', '136'],
    thInfo: [
        { text: '결제일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '쿠폰', rowSpan: 2, colSpan: 1, className: '' },
        { text: '사용메뉴', rowSpan: 2, colSpan: 1, className: '' },
        { text: '쿠폰 사용금액', rowSpan: 2, colSpan: 1, className: '' },
        { text: '거래기기', rowSpan: 2, colSpan: 1, className: '' },
        { text: '주문자', rowSpan: 2, colSpan: 1, className: '' },
        { text: '본사발행 쿠폰 결제내역', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
} as const;

const COUPON_TYPE: Record<string, number> = {
    ALL: 0,
} as const;

const COUPON_TYPE_OPTION = {
    [COUPON_TYPE.ALL]: { title: '쿠폰 전체', value: COUPON_TYPE.ALL },
} as const;

const COUPON_TOTAL_TITLE = {
    [COUPON_TYPE.ALL]: '본사 쿠폰 사용금액 합계',
} as const;

const DEVICE_TYPE = {
    KIOSK: '키오스크',
    APP: '어플',
    ALL: '거래기기 전체',
} as const;

const DEVICE_TYPE_OPTION = {
    [DEVICE_TYPE.ALL]: { title: '거래기기 전체', value: '거래기기 전체' },
    [DEVICE_TYPE.KIOSK]: { title: '키오스크', value: '키오스크' },
    [DEVICE_TYPE.APP]: { title: '어플', value: '어플' },
} as const;

type CouponType = {
    [key: number]: { title: string, value: number }
};

interface TableTopInfo {
    titleFrom: string,
    titleTo: string,
    totalInfo: TotalInfo,
};

type TotalInfo = {
    [key: number]: { title: string, sum: number },
};