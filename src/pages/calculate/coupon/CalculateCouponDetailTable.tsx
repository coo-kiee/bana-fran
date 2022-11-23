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
import CalanderSearch from "pages/common/calanderSearch";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import NoData from "pages/common/noData";
import CalculateDetailTableBottom from "../component/CalculateDetailTableBottom";

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
        0: { title: '쿠폰 전체', value: 0 },
    });
    const { data: couponList } = CALCULATE_SERVICE.useCalculateCouponType(['couponList', JSON.stringify({ f_code, staff_no })], f_code, staff_no);
    useEffect(() => {
        if (couponList) {
            const [couponObj, tableTopTotalObj] = couponList.reduce((res, cur) => {
                const title = cur.code_name;
                const value = cur.code;
                res[0][value] = { title, value }; // couponObj
                res[1][value] = { title, sum: 0 }; // tableTopTotalObj
                return res;
            }, [{}, {}] as [CouponType, sumInfo]);
            setCouponType(prev => ({ ...prev, ...couponObj }));
            setTableTopInfo(prev => ({ ...prev, ...tableTopTotalObj }));
        };
    }, [couponList]);

    // 검색 조건
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-01');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchOption: [couponType[0], DEVICE_TYPE.ALL,], // 필터링 옵션
        searchTrigger: false, // query trigger
    });

    // 테이블 상단 정보
    const [tableTopInfo, setTableTopInfo] = useState<TableTopInfo>({
        titleFrom: Utils.converDateFormat(searchCondition.from, '-'),
        titleTo: Utils.converDateFormat(searchCondition.to, '-'),
        allCouponSum: 0,
    });

    // 페이지네이션 정보
    const [pageInfo, setPageInfo] = useState({
        dataCnt: 0,
        currentPage: 1,
        row: 50,
    });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null); // 엑셀 다운에 사용

    return (
        <>
            <TableTop couponType={couponType} searchCondition={searchCondition} setSearchCondition={setSearchCondition} tableTopInfo={tableTopInfo} />
            <div>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                    {/* Column Width */}
                    <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                    {/* Table Header  */}
                    <thead>
                        <tr>{thInfo.map((th, index) => <th key={index} className={th.className} colSpan={th.colSpan} rowSpan={th.rowSpan} >{th.text}</th>)}</tr>
                        <tr>{tdInfo.map((text, index) => <th key={index} className="price-area" >{text}</th>)}</tr>
                    </thead>
                    <tbody>
                        {/* List */}
                        <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail', e)}>
                            <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                                <TableList couponType={couponType} fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} />
                            </Suspense>
                        </ErrorBoundary>
                    </tbody>
                </table>
            </div>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={'본사_쿠폰_결제내역'} />
        </>
    );
}

export default CalculateCouponDetailTable;




interface TableTopProps {
    couponType: CouponType,
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    tableTopInfo: TableTopInfo,
};
const TableTop: FC<TableTopProps> = ({ couponType, searchCondition, setSearchCondition, tableTopInfo }) => {

    const { titleFrom, titleTo } = tableTopInfo;

    // 조회 버튼 클릭
    const handleSearch = () => {
        setSearchCondition(prev => ({ ...prev, searchTrigger: !prev.searchTrigger }));
    };


    return (
        <>
            <CalanderSearch
                title={'상세내역'}
                dateType={'yyyy-MM-dd'}
                searchInfo={searchCondition}
                setSearchInfo={setSearchCondition}
                optionType={'SELECT'}
                selectOption={[couponType, DEVICE_TYPE]} // select로 나타날 옵션 정보
                optionList={[Object.keys(couponType), Object.keys(DEVICE_TYPE)]} // option 맵핑할 때 사용  
                handleSearch={() => { handleSearch() }}
            />
            <div className="search-result-wrap">
                {
                    <>
                        <div className="search-date">
                            <p>조회기간: {titleFrom} ~ {titleTo}</p>
                        </div>
                        <ul className="search-result">
                            {
                                Object.values(couponType).map((coupon, index) => (
                                    tableTopInfo[coupon.value] && <li key={index}>{tableTopInfo[coupon.value].title} : <span className="value">{Utils.numberComma(tableTopInfo[coupon.value].sum)}원</span></li>
                                ))
                            }
                            <li>본사 쿠폰 사용금액 합계 : <span className="value">{Utils.numberComma(tableTopInfo.allCouponSum)}원</span></li>
                        </ul>
                    </>
                }
            </div>
        </>
    )
};

interface TableListProps {
    couponType: CouponType,
    fCode: number,
    staffNo: number,
    searchCondition: SearchCondition,
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
const TableList: FC<TableListProps> = ({ couponType, fCode, staffNo, searchCondition, setTableTopInfo, pageInfo, setPageInfo }) => {

    const { currentPage, row } = pageInfo;
    const { searchOption, from, to, searchTrigger } = searchCondition;
    const fromDate = Utils.converDateFormat(from, '-');
    const toDate = Utils.converDateFormat(to, '-');

    // eslint-disable-next-line
    const listQueryKey = useMemo(() => ['calculateCouponDetail', JSON.stringify({ fCode, staffNo, fromDate, toDate })], [fCode, staffNo, searchTrigger]);
    const { data: couponDetailList } = CALCULATE_SERVICE.useCalculateCouponDetail(listQueryKey, fCode, staffNo, fromDate, toDate);

    // Table render Node 필터링, 쿠폰 사용금액 합계 계산
    const [renderTableList, totalSumObj] = useMemo(() => {

        // 쿠폰 종류 데이터 fetched 안됐을 때
        if (Object.values(couponType).length < 2) return [];

        // 쿠폰 합계 객체 생성
        const sumObj = Object.values(couponType).reduce((arr, cur) => {
            if (cur.value !== 0) arr[cur.value] = { title: cur.title, sum: 0 };
            return arr;
        }, { allCouponSum: 0 } as sumInfo);

        // 필터링 된 Table List 생성
        const tableList = couponDetailList?.reduce((arr, couponDetail, index) => {

            const { rcp_date, item_type, item_type_code, sItem, total_amt, rcp_type, phone, supply_amt, vat_amt } = couponDetail;
            const [date] = rcp_date.split(' '); // [date, time]

            // 합계 계산
            sumObj[item_type_code].sum += total_amt;
            sumObj.allCouponSum += total_amt;

            // 필터링 조건
            const showCoupon = Number(searchOption[0].value);
            const isCouponType = showCoupon === couponType[0].value || showCoupon === item_type_code;
            const isDeviceType = searchOption[1].value === DEVICE_TYPE.ALL.value || searchOption[1].value === rcp_type;

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

        return [tableList, sumObj];
    }, [couponDetailList, searchOption, couponType]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, ...totalSumObj, titleFrom: fromDate, titleTo: toDate }));
        // eslint-disable-next-line
    }, [setTableTopInfo, totalSumObj, renderTableList]);

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

const DEVICE_TYPE = {
    ALL: { title: '거래기기 전체', value: '거래기기 전체' },
    KIOSK: { title: '키오스크', value: '키오스크' },
    APP: { title: '어플', value: '어플' },
} as const;

interface SearchCondition extends SearchInfoSelectType {
    searchTrigger: boolean,
};

type CouponType = {
    [key: number]: { title: string, value: number }
};

type sumInfo = {
    [key: number]: { title: string, sum: number },
    allCouponSum: number,
};

interface TableTopInfo extends sumInfo {
    titleFrom: string,
    titleTo: string,
};