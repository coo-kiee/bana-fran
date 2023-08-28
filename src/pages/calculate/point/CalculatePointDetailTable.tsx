import React, { FC, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// API
import CALCULATE_SERVICE from "service/calculateService";

// Util
import Utils from "utils/Utils";

// Date
import { format, lastDayOfMonth, subMonths } from "date-fns";

// Type
import { OPTION_TYPE, SearchInfoSelectType } from "types/etc/etcType";

// Component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import NoData from "pages/common/noData";
import CalculateDetailTableBottom from "../component/CalculateDetailTableBottom";
import CalculateDetailTableTop from "../component/CalculateDetailTableTop";
import CalculateTableHeader from "../component/CalculateTableHeader";

interface CalculatePointDetailTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const CalculatePointDetailTable: FC<CalculatePointDetailTableProps> = ({ userInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // 검색 조건
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-01');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const [searchCondition, setSearchCondition] = useState<SearchInfoSelectType>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchOption: [POINT_TYPE_OPTION[POINT_TYPE.ALL], DEVICE_TYPE_OPTION[DEVICE_TYPE.ALL],], // 필터링 옵션
    });
    const [queryTriggerDate, setQueryTriggerDate] = useState({
        queryFromDate: searchCondition.from,
        queryToDate: searchCondition.to,
    });

    // 테이블 상단 정보
    const [tableTopInfo, setTableTopInfo] = useState<TableTopInfo>({
        titleFrom: fromDate,
        titleTo: toDate,
        totalInfo: {} as TotalInfo,
    });

    // 테이블 상단 검색영역 파라미터
    const calanderSearchOption = useMemo(() => ({
        title: '상세내역',
        dateType: 'yyyy-MM-dd',
        optionType: OPTION_TYPE.SELECT, // 'SELECT' as const,
        selectOption: [POINT_TYPE_OPTION, DEVICE_TYPE_OPTION], // select로 나타날 옵션 정보
        optionList: [Object.keys(POINT_TYPE_OPTION), Object.keys(DEVICE_TYPE_OPTION)], // option 맵핑할 때 사용  
        handleSearch: () => setQueryTriggerDate(prev => ({ queryFromDate: searchCondition.from, queryToDate: searchCondition.to, })),
    }), [setQueryTriggerDate, searchCondition]);

    // 페이지네이션 정보
    const [pageInfo, setPageInfo] = useState({
        dataCnt: 0,
        currentPage: 1,
        row: 20,
    });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

    return (
        <>
            <CalculateDetailTableTop calanderSearchOption={calanderSearchOption} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} totalInfo={tableTopInfo.totalInfo} searchCondition={searchCondition} setSearchCondition={setSearchCondition} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <CalculateTableHeader width={width} thInfo={thInfo} tdInfo={tdInfo} />
                <tbody>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail', e)}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                            <TableList fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} queryTriggerDate={queryTriggerDate} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={'유상포인트 결제내역'} />
        </>
    );
}

export default CalculatePointDetailTable;




interface TableListProps {
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
const TableList: FC<TableListProps> = ({ fCode, staffNo, searchCondition, queryTriggerDate, setTableTopInfo, pageInfo, setPageInfo }) => {

    const { currentPage, row } = pageInfo;
    const { searchOption } = searchCondition;
    const { queryFromDate, queryToDate } = queryTriggerDate;

    const { data: pointDetailList } = CALCULATE_SERVICE.useCalculatePointDetailList(fCode, staffNo, queryFromDate, queryToDate);

    // Table render Node 필터링, 충전/잔돈 포인트 합계 계산
    const [renderTableList, totalInfoRes] = useMemo(() => {

        // 합계 계산 객체
        const totalObj = Object.values(POINT_TYPE).reduce((arr, cur) => {
            const totalTitle = POINT_TOTAL_TITLE[cur];
            arr[cur] = { title: totalTitle, sum: 0 };
            return arr;
        }, {} as TotalInfo);

        // 필터링 된 Table List 생성
        const tableList = pointDetailList?.reduce((arr, pointDetail, index) => {
            const isCurrentPage = (index >= (currentPage - 1) * row && index < currentPage * row);

            // 합계 계산
            if (pointDetail.bonus_point_type) totalObj[pointDetail.bonus_point_type as keyof TotalInfo].sum += pointDetail.total_bonus_amt;
            if (pointDetail.use_point_type) totalObj[pointDetail.use_point_type as keyof TotalInfo].sum += pointDetail.total_paid_amt;
            totalObj.전체포인트.sum += pointDetail.total_amt;

            // 필터링 조건
            const isPointType = searchOption[0].value === POINT_TYPE_OPTION[POINT_TYPE.ALL].value || searchOption[0].value === pointDetail.use_point_type || searchOption[0].value === pointDetail.bonus_point_type;
            const isDeviceType = searchOption[1].value === DEVICE_TYPE_OPTION[DEVICE_TYPE.ALL].value || searchOption[1].value === pointDetail.rcp_type;

            const rowSpan = pointDetail.bonus_point_type ? 2 : 1

            if (isPointType && isDeviceType) {
                arr.push(
                    <>
                        <tr style={{ display: isCurrentPage ? '' : 'none' }}>
                            <td className="align-center" rowSpan={rowSpan}>{pointDetail.rcp_date.split(' ')[0]}</td>
                            <td className="align-left" rowSpan={rowSpan}>{pointDetail.item_name}</td>
                            <td className="align-center" rowSpan={rowSpan}>{pointDetail.phone}</td>
                            <td className="align-right" rowSpan={rowSpan}>{Utils.numberComma(pointDetail.nChargeTotal)}</td>
                            <td className="align-right" rowSpan={rowSpan}>{Utils.numberComma(pointDetail.total_amt)}</td>
                            <td className="align-center" >{pointDetail.use_point_type}</td>
                            <td className="align-center" rowSpan={rowSpan}>{pointDetail.rcp_type}</td>
                            <td className="align-right" >{Utils.numberComma(pointDetail.supply_amt)}</td>
                            <td className="align-right" >{Utils.numberComma(pointDetail.vat_amt)}</td>
                            <td className="align-right" >{Utils.numberComma(pointDetail.total_paid_amt)}</td>
                            <td className="align-right" >{Utils.numberComma(pointDetail.fee_supply_amt)}</td>
                            <td className="align-right" >{Utils.numberComma(pointDetail.fee_vat_amt)}</td>
                            <td className="align-right" >{Utils.numberComma(pointDetail.fee_supply_amt + pointDetail.fee_vat_amt)}</td>
                        </tr>
                        {
                            pointDetail.bonus_point_type &&
                            <tr style={{ display: isCurrentPage ? '' : 'none' }}>
                                <td className="align-center" >{pointDetail.bonus_point_type}</td>
                                <td className="align-right" >{Utils.numberComma(pointDetail.bonus_supply_amt)}</td>
                                <td className="align-right" >{Utils.numberComma(pointDetail.bonus_vat_amt)}</td>
                                <td className="align-right" >{Utils.numberComma(pointDetail.total_bonus_amt)}</td>
                                <td className="align-right" >{Utils.numberComma(pointDetail.fee_bonus_supply_amt)}</td>
                                <td className="align-right" >{Utils.numberComma(pointDetail.fee_bonus_vat_amt)}</td>
                                <td className="align-right" >{Utils.numberComma(pointDetail.fee_bonus_supply_amt + pointDetail.fee_bonus_vat_amt)}</td>
                            </tr>
                        }
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        return [tableList, totalObj];
    }, [currentPage, pointDetailList, row, searchOption]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList?.length) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList?.length]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, titleFrom: queryFromDate, titleTo: queryToDate, totalInfo: totalInfoRes }));
    }, [setTableTopInfo, renderTableList, totalInfoRes, queryFromDate, queryToDate]);

    return (
        <>
            {/* 페이지네이션 적용 */}
            {renderTableList?.map((item, index) => {
                return (<React.Fragment key={index} >{item}</React.Fragment>);
            })}
            {renderTableList?.length === 0 && <NoData isTable={true} />}
        </>
    )
};

// Component Type
const TABLE_COLUMN_INFO = {
    width: ['100', '250', '136', '100', '100', '134', '92', '100', '100', '100', '100', '100', '100'],
    thInfo: [
        { text: '결제일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '주문메뉴', rowSpan: 2, colSpan: 1, className: '' },
        { text: '주문자', rowSpan: 2, colSpan: 1, className: '' },
        { text: '총 주문금액', rowSpan: 2, colSpan: 1, className: '' },
        { text: '유상포인트 사용금액', rowSpan: 2, colSpan: 1, className: '' },
        { text: '유상포인트 구분', rowSpan: 2, colSpan: 1, className: '' },
        { text: '거래기기', rowSpan: 2, colSpan: 1, className: '' },
        { text: '유상포인트 결제금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
        { text: '수수료 (2.2%)', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계', '공급가 (2%)', '부가세 (0.2%)', '합계 (2.2%)']
} as const;

const POINT_TYPE = {
    CHARGE: '충전포인트',
    CHANGE: '잔돈포인트',
    BONUS_CHARGE: '보너스 충전포인트',
    ALL: '전체포인트',
} as const;
type PointType = typeof POINT_TYPE[keyof typeof POINT_TYPE];

const POINT_TYPE_OPTION = {
    [POINT_TYPE.ALL]: { title: '포인트 구분 전체', value: POINT_TYPE.ALL }, // Option default 값 전체로 오려면 ALL이 제일 위에 있어야함
    [POINT_TYPE.CHARGE]: { title: POINT_TYPE.CHARGE, value: POINT_TYPE.CHARGE },
    [POINT_TYPE.CHANGE]: { title: POINT_TYPE.CHANGE, value: POINT_TYPE.CHANGE },
    [POINT_TYPE.BONUS_CHARGE]: { title: POINT_TYPE.BONUS_CHARGE, value: POINT_TYPE.BONUS_CHARGE },
} as const;


const POINT_TOTAL_TITLE = {
    [POINT_TYPE.CHARGE]: '충전포인트 사용금액 합계',
    [POINT_TYPE.BONUS_CHARGE]: '충전포인트(보너스) 사용금액 합계',
    [POINT_TYPE.CHANGE]: '잔돈포인트 사용금액 합계',
    [POINT_TYPE.ALL]: '유상(충전+보너스+잔돈)포인트 사용금액 합계',
} as const;
type PointTotalTitle = typeof POINT_TOTAL_TITLE[keyof typeof POINT_TOTAL_TITLE];

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

type TableTopInfo = {
    titleFrom: string,
    titleTo: string,
    totalInfo: TotalInfo,
};

// 포인트 타입 서버에서 가져올 시 CalculateCouponDetailTable 참조
type TotalInfo = { [key in PointType]: { title: PointTotalTitle, sum: number } };