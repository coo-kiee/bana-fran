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
import { CalculateChargeMultiplyKey, CALCULATE_CHARGE_MULTIPLY, CALCULATE_CHARGE_TYPE } from "types/calculate/calculateType";

interface CalculateEtcDetailTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const CalculateEtcDetailTable: FC<CalculateEtcDetailTableProps> = ({ userInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // 검색 조건
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM');
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchOption: [ETC_TYPE_OPTION[ETC_TYPE.ALL]],  // 필터링 옵션
        searchTrigger: false, // query trigger
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
        dateType: 'yyyy-MM',
        optionType: 'SELECT' as const,
        selectOption: [ETC_TYPE_OPTION], // select로 나타날 옵션 정보
        optionList: [Object.keys(ETC_TYPE_OPTION)], // option 맵핑할 때 사용  
        showMonthYearPicker: true,
        handleSearch: () => setSearchCondition(prev => ({ ...prev, searchTrigger: !prev.searchTrigger })),
    }), [setSearchCondition]);

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
                            <TableList fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={'기타 정산 내역'} />
        </>
    );
}

export default CalculateEtcDetailTable;




interface TableListProps {
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
const TableList: FC<TableListProps> = ({ fCode, staffNo, searchCondition, setTableTopInfo, pageInfo, setPageInfo }) => {

    const { currentPage, row } = pageInfo;
    const { searchOption, from, to, searchTrigger } = searchCondition;

    // eslint-disable-next-line
    const listQueryKey = useMemo(() => ['calculateEtcDetail', JSON.stringify({ fCode, staffNo, from, to })], [fCode, staffNo, searchTrigger]);
    const { data: etcDetailList } = CALCULATE_SERVICE.useCalculateEtcDetail(listQueryKey, fCode, staffNo, Utils.converDateFormat(new Date(from), '-'), Utils.converDateFormat(lastDayOfMonth(new Date(to)), '-'));

    // Table render Node 필터링, 충전/잔돈 포인트 합계 계산
    const [renderTableList, totalInfoRes] = useMemo(() => {

        // 합계 계산 객체
        const totalObj = Object.values(ETC_TYPE).reduce((arr, cur) => {
            const totalTitle = ETC_TOTAL_TITLE[cur];
            if (totalTitle) arr[cur] = { title: totalTitle, sum: 0 };
            return arr;
        }, {} as TotalInfo);;

        // 필터링 된 Table List 생성
        const tableList = etcDetailList?.reduce((arr, etcDetail, index) => {

            const { std_month, calculate_type, item_detail, supply_amt, vat_amt, total_amt } = etcDetail;
            const calculateType: CalculateChargeMultiplyKey = calculate_type as CalculateChargeMultiplyKey;

            // 합계 계산
            totalObj[calculateType].sum += (Number(total_amt) * CALCULATE_CHARGE_MULTIPLY[calculateType]);

            // 필터링 조건
            const isCaclulateType = searchOption[0].value === ETC_TYPE_OPTION[ETC_TYPE.ALL].value || searchOption[0].value === calculate_type;

            if (isCaclulateType) {
                arr.push(
                    <>
                        <td className="align-center">{std_month}</td>
                        <td className="align-center">{calculate_type}</td>
                        <td className="align-left">{item_detail}</td>
                        <td className="align-right">{Utils.numberComma(supply_amt * CALCULATE_CHARGE_MULTIPLY[calculateType])}</td>
                        <td className="align-right">{Utils.numberComma(vat_amt * CALCULATE_CHARGE_MULTIPLY[calculateType])}</td>
                        <td className="align-right"><strong>{Utils.numberComma(total_amt * CALCULATE_CHARGE_MULTIPLY[calculateType])}</strong></td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        return [tableList, totalObj];
    }, [etcDetailList, searchOption]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, titleFrom: from, titleTo: to, totalInfo: totalInfoRes }));
        // eslint-disable-next-line
    }, [setTableTopInfo, renderTableList, totalInfoRes]);

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
    width: ['128', '68', '*', '130', '130', '130'],
    thInfo: [
        { text: '정산월', rowSpan: 2, colSpan: 1, className: '' },
        { text: '구분', rowSpan: 2, colSpan: 1, className: '' },
        { text: '내용', rowSpan: 2, colSpan: 1, className: '' },
        { text: '기타 정산 금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
} as const;

const ETC_TYPE = {
    ...CALCULATE_CHARGE_TYPE,
    ALL: '구분전체',
} as const;
type EtcType = typeof ETC_TYPE[keyof typeof ETC_TYPE];

const ETC_TYPE_OPTION = {
    [ETC_TYPE.ALL]: { title: '구분 전체', value: ETC_TYPE.ALL },
    [ETC_TYPE.BILLING]: { title: '청구', value: ETC_TYPE.BILLING },
    [ETC_TYPE.CONSERVATION]: { title: '보전', value: ETC_TYPE.CONSERVATION },
} as const;

const ETC_TOTAL_TITLE = {
    [ETC_TYPE.BILLING]: '청구 금액 합계',
    [ETC_TYPE.CONSERVATION]: '보전 금액 합계',
    [ETC_TYPE.ALL]: '',
} as const;
type EtcTotalTitle = typeof ETC_TOTAL_TITLE[keyof typeof ETC_TOTAL_TITLE];

interface SearchCondition extends SearchInfoSelectType {
    searchTrigger: boolean,
};

type TableTopInfo = {
    titleFrom: string,
    titleTo: string,
    totalInfo: TotalInfo,
};

// // 포인트 타입 서버에서 가져올 시 CalculateCouponDetailTable 참조
type TotalInfo = { [key in EtcType]: { title: EtcTotalTitle, sum: number } };