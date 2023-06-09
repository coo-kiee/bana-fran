import { FC, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// API
import CALCULATE_SERVICE from "service/calculateService";

// Util
import Utils from "utils/Utils";

// Type
import { SearchInfoType } from "types/etc/etcType";
import { CLAIM_TAB_TYPE, TabType } from "types/calculate/calculateType";
import { TabSearchDateInfo } from ".";

// Component
import Loading from "pages/common/loading";
import CalanderSearch from "pages/common/calanderSearch";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import NoData from "pages/common/noData";
import CalculateDetailTableBottom from "pages/calculate/component/CalculateDetailTableBottom";
import CalculateTableHeader from "../component/CalculateTableHeader";

interface CalculateClaimDetailTableProps {
    tabType: TabType,
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
    tabSearchDateInfo: TabSearchDateInfo,
    setTabSearchDateInfo: React.Dispatch<React.SetStateAction<TabSearchDateInfo>>,
};
const CalculateClaimDetailTable: FC<CalculateClaimDetailTableProps> = ({ tabType, userInfo, tabSearchDateInfo, setTabSearchDateInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // 검색 조건
    const { fromDate, toDate } = tabSearchDateInfo[tabType];
    const [calenderSearchType, setCalenderSearchType] = useState<string>(SEARCH_TYPE["쿠폰 발행일시"]);
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchTrigger: false, // query trigger
    });

    // 테이블 상단 정보
    const tableTopTotalObj = Object.values(SUM_LIST).reduce((arr, cur: SumList[number]) => {
        const isCalculate = CLAIM_TAB_TYPE.CALCULATE === tabType;
        if (isCalculate && cur.type !== SUM_TYPE.USE) return arr;

        if (cur.type) arr[cur.type] = { title: cur.title, sum: 0 };
        return arr;
    }, {} as TotalList);

    const [tableTopInfo, setTableTopInfo] = useState<TableTopInfo>({
        titleFrom: Utils.converDateFormat(searchCondition.from, '-'),
        titleTo: Utils.converDateFormat(searchCondition.to, '-'),
        totalObj: tableTopTotalObj,
    });

    // 탭 변경 시, tabSearchDateInfo 변경 시 쿼리 실행
    useEffect(() => {

        // 검색 조건 변경
        setSearchCondition(prev => ({
            from: fromDate, // 달력 선택 정보
            to: toDate, // 달력 선택 정보
            searchTrigger: !prev.searchTrigger
        }));

        // 테이블 상단 정보 변경
        setTableTopInfo(prev => ({ ...prev, totalObj: tableTopTotalObj }));

    }, [fromDate, toDate, setSearchCondition, tabType])

    const [pageInfo, setPageInfo] = useState({
        dataCnt: 0,
        currentPage: 1,
        row: 20,
    });

    const TABLE_COLUMN_INFO = {
        width: CLAIM_TAB_TYPE.CLAIM === tabType ? ['130', '130', '88', '150', '109', '130', '136', '*', '130', '130', '109', '130', '130', '130'] : ['130', '130', '88', '150', '109', '130', '136', '130', '130', '109', '130', '130', '130'],
        thInfo: CLAIM_TAB_TYPE.CLAIM === tabType ? [
            { text: '쿠폰 발행일시', rowSpan: 2, colSpan: 1, className: '' },
            { text: '쿠폰 사용일시', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용여부', rowSpan: 2, colSpan: 1, className: '' },
            { text: '쿠폰명', rowSpan: 2, colSpan: 1, className: '' },
            { text: `쿠폰발행\n(최대)금액`, rowSpan: 2, colSpan: 1, className: '' },
            { text: '유효기간', rowSpan: 2, colSpan: 1, className: '' },
            { text: '발급고객', rowSpan: 2, colSpan: 1, className: '' },
            { text: '클레임 내용', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용매장', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용자', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용금액', rowSpan: 2, colSpan: 1, className: '' },
            { text: '클레임 쿠폰 사용 금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
        ] : [
            { text: '쿠폰 발행일시', rowSpan: 2, colSpan: 1, className: '' },
            { text: '쿠폰 사용일시', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용여부', rowSpan: 2, colSpan: 1, className: '' },
            { text: '쿠폰명', rowSpan: 2, colSpan: 1, className: '' },
            { text: `쿠폰발행\n(최대)금액`, rowSpan: 2, colSpan: 1, className: '' },
            { text: '유효기간', rowSpan: 2, colSpan: 1, className: '' },
            { text: '발급고객', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용매장', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용자', rowSpan: 2, colSpan: 1, className: '' },
            { text: '사용금액', rowSpan: 2, colSpan: 1, className: '' },
            { text: '클레임 쿠폰 사용 금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
        ],
        tdInfo: ['공급가', '부가세', '합계']
    } as const;

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null); // 엑셀 다운에 사용

    return (
        <>
            <TableTop tabType={tabType} searchCondition={searchCondition} setSearchCondition={setSearchCondition} tableTopInfo={tableTopInfo} setTabSearchDateInfo={setTabSearchDateInfo} calenderSearchType={calenderSearchType} setCalenderSearchType={setCalenderSearchType} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <CalculateTableHeader width={width} thInfo={thInfo} tdInfo={tdInfo} />
                <tbody>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail', e)}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                            <TableList tabType={tabType} fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} tableTopInfo={tableTopInfo} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} calenderSearchType={calenderSearchType} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={'고객 클레임 보상내역'} />
        </>
    );
}

export default CalculateClaimDetailTable;


interface CalanderSearchTypeSelectorProps {
    calenderSearchType: string,
    setCalenderSearchType: React.Dispatch<React.SetStateAction<string>>,
};

const CalanderSearchTypeSelector: FC<CalanderSearchTypeSelectorProps> = ({ calenderSearchType, setCalenderSearchType }) => {

    return (
        <select value={calenderSearchType} onChange={(e) => setCalenderSearchType(e.target.value)}>
            {
                Object.entries(SEARCH_TYPE).map(([text, value]) => <option key={value} value={value}>{text}</option>)
            }
        </select>
    )
}

interface TableTopProps {
    tabType: TabType,
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    tableTopInfo: TableTopInfo,
    setTabSearchDateInfo: React.Dispatch<React.SetStateAction<TabSearchDateInfo>>,
    calenderSearchType: string,
    setCalenderSearchType: React.Dispatch<React.SetStateAction<string>>,
};
const TableTop: FC<TableTopProps> = ({ tabType, searchCondition, setSearchCondition, tableTopInfo, setTabSearchDateInfo, calenderSearchType, setCalenderSearchType }) => {

    const { titleFrom, titleTo, totalObj } = tableTopInfo;

    // 조회버튼 클릭 시 tabSearchDateInfo 변경해서 쿼리 실행 - line 44
    const handleSearch = () => {
        const { from, to } = searchCondition;
        const fromDate = Utils.converDateFormat(from, '-');
        const toDate = Utils.converDateFormat(to, '-');
        setTabSearchDateInfo(prev => ({ ...prev, [tabType]: { fromDate, toDate } }));
    };

    return (
        <>
            <CalanderSearch
                dateTitle={tabType === CLAIM_TAB_TYPE.CLAIM ? <CalanderSearchTypeSelector calenderSearchType={calenderSearchType} setCalenderSearchType={setCalenderSearchType} /> : '사용일시'}
                dateType={'yyyy-MM-dd'}
                searchInfo={searchCondition}
                setSearchInfo={setSearchCondition}
                handleSearch={() => { handleSearch() }}
            />
            <div className="search-result-wrap">
                {
                    <>
                        <div className="search-date">
                            <p>조회기간: {titleFrom} ~ {titleTo}</p>
                        </div>
                        <ul className="search-result">
                            {totalObj && Object.values(totalObj).map((total, index) => <li key={index}>{total.title} : <span className="value">{Utils.numberComma(total.sum)}원</span></li>)}
                        </ul>
                    </>
                }
            </div>
        </>
    )
};

interface TableListProps {
    tabType: TabType,
    fCode: number,
    staffNo: number,
    searchCondition: SearchCondition,
    tableTopInfo: TableTopInfo,
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
    calenderSearchType: string,
};
const TableList: FC<TableListProps> = ({ tabType, fCode, staffNo, searchCondition, tableTopInfo, setTableTopInfo, pageInfo, setPageInfo, calenderSearchType }) => {

    const { from, to, searchTrigger } = searchCondition;
    const fromDate = Utils.converDateFormat(from, '-');
    const toDate = Utils.converDateFormat(to, '-');

    // eslint-disable-next-line
    const listQueryKey = useMemo(() => ['calculateClaimDetail', JSON.stringify({ tabType, fCode, staffNo, fromDate, toDate, calenderSearchType: tabType === CLAIM_TAB_TYPE.CLAIM ? calenderSearchType : '' })], [fCode, staffNo, searchTrigger, tabType, calenderSearchType]);
    // Query
    const { data: claimDetailList } = CALCULATE_SERVICE.useCalculateClaimDetailList(listQueryKey, tabType, fCode, staffNo, fromDate, toDate, calenderSearchType);

    // Table render Node 필터링, 클레임 보상 쿠폰 합계 계산
    const [renderTableList, totalSumObj] = useMemo(() => {

        const sumObj = Object.entries(tableTopInfo.totalObj).reduce((arr, cur) => {
            arr[cur[0] as SumList[number]['type']] = { ...cur[1], title: cur[1].title, sum: 0 };
            
            return arr;
        }, {} as TotalList);

        // 필터링 된 Table List 생성
        const tableList = claimDetailList?.reduce((arr, claimDetail, index) => {

            const { send_date, use_date, use_flag, coupon_title, coupon_amt, expiration_date, send_phone, claim_text, use_f_name, use_phone, coupon_charge, supply_amt, vat_amt } = claimDetail;

            // 합계 계산
            if (SUM_TYPE.PUBLISH in sumObj) sumObj[SUM_TYPE.PUBLISH].sum += coupon_amt;
            if (use_flag === SUM_TYPE.USE && SUM_TYPE.USE in sumObj) sumObj[SUM_TYPE.USE].sum += coupon_charge;
            else if (use_flag === SUM_TYPE.EXPIRATION && SUM_TYPE.EXPIRATION in sumObj) sumObj[SUM_TYPE.EXPIRATION].sum += coupon_amt;

            arr.push(
                <tr key={index}>
                    <td className="align-center">{send_date.replace(' ', '\n')}</td>
                    <td className="align-center">{use_date.replace(' ', '\n')}</td>
                    <td className="align-center">{use_flag}</td>
                    <td className="align-center">{coupon_title}</td>
                    <td className="align-right">{Utils.numberComma(coupon_amt)}</td>
                    <td className="align-center">{expiration_date.replace(' ', '\n')}</td>
                    <td className="align-center">{send_phone}</td>
                    {tabType === CLAIM_TAB_TYPE.CLAIM && <td className="align-left">{claim_text}</td>}
                    <td className="align-center">{use_f_name}</td>
                    <td className="align-center">{use_phone}</td>
                    <td className="align-right">{Utils.numberComma(coupon_charge)}</td>
                    <td className="align-right">{Utils.numberComma(supply_amt)}</td>
                    <td className="align-right">{Utils.numberComma(vat_amt)}</td>
                    <td className="align-right">{Utils.numberComma(coupon_charge)}</td>
                </tr>
            )
            return arr;
        }, [] as ReactNode[]);

        return [tableList, sumObj];
    }, [claimDetailList, listQueryKey]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, titleFrom: fromDate, titleTo: toDate, totalObj: totalSumObj }));
        // eslint-disable-next-line
    }, [setTableTopInfo, totalSumObj, claimDetailList]);

    return (
        <>
            {/* 페이지네이션 적용 */}
            {renderTableList?.map((item, index) => (index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row) && item)}
            {renderTableList?.length === 0 && <NoData isTable={true} />}
            {/* // <NoData isTable={true} /> */}
        </>
    )
};

// Component Type

interface SearchCondition extends SearchInfoType {
    searchTrigger: boolean,
};

type TableTopInfo = {
    titleFrom: string,
    titleTo: string,
    totalObj: TotalList,
};

const SEARCH_TYPE = {
    '쿠폰 발행일시': '발행일자',
    '쿠폰 사용일시': '사용일자',
} as const;

const SUM_TYPE = {
    PUBLISH: '발행',
    EXPIRATION: '만료',
    USE: '사용'
} as const

const SUM_LIST = [
    { title: '클레임 보상 쿠폰 발행금액 합계', type: SUM_TYPE.PUBLISH },
    { title: '클레임 보상 쿠폰 만료금액 합계', type: SUM_TYPE.EXPIRATION },
    { title: '클레임 보상 쿠폰 사용금액 합계', type: SUM_TYPE.USE },
] as const;

type SumList = typeof SUM_LIST;
type TotalList = { [key in SumList[number]['type']]: { title: string, sum: number } };