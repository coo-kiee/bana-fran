import { FC, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// API
import CALCULATE_SERVICE from "service/calculateService";

// Util
import Utils from "utils/Utils";

// Type
import { SearchInfoType } from "types/etc/etcType";
import { AffilateTabType, AFFILIATE_TAB_TYPE } from "types/calculate/calculateType";
import { TabSearchDateInfo } from ".";

// Component
import Loading from "pages/common/loading";
import CalanderSearch from "pages/common/calanderSearch";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import NoData from "pages/common/noData";
import CalculateDetailTableBottom from "pages/calculate/component/CalculateDetailTableBottom";
import CalculateTableHeader from "../component/CalculateTableHeader";

interface ICalculateAffiliateDetailTable {
    tabType: AffilateTabType,
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
    tabSearchDateInfo: TabSearchDateInfo,
    setTabSearchDateInfo: React.Dispatch<React.SetStateAction<TabSearchDateInfo>>,
};
const CalculateAffiliateDetailTable: FC<ICalculateAffiliateDetailTable> = ({ tabType, userInfo, tabSearchDateInfo, setTabSearchDateInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // 검색 조건
    const { fromDate, toDate } = tabSearchDateInfo[tabType];
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchTrigger: false, // query trigger
    });

    const isCoupon = AFFILIATE_TAB_TYPE.COUPON === tabType;

    // 테이블 상단 정보
    const tableTopTotalObj = Object.values(SUM_LIST).reduce((arr, cur: SumList[number]) => {
        if (isCoupon && cur.type !== SUM_TYPE.USE) return arr;

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
        width: isCoupon ? ['130', '*', '*', '*', '130', '150', '130', '130', '130'] : ['130', '130', '88', '150', '109', '130', '136', '130', '130', '109', '130', '130', '130'],
        thInfo: isCoupon ? [
            { text: '결제일시', rowSpan: 2, colSpan: 1, className: '' },
            { text: '쿠폰', rowSpan: 2, colSpan: 1, className: '' },
            { text: '발행사', rowSpan: 2, colSpan: 1, className: '' },
            { text: '주문메뉴', rowSpan: 2, colSpan: 1, className: '' },
            { text: `주문자`, rowSpan: 2, colSpan: 1, className: '' },
            { text: '제휴사 쿠폰 사용금액\n(권면금액)', rowSpan: 2, colSpan: 1, className: '' },
            { text: '제휴사 쿠폰 결제내역 (수수료 차감전 기준)', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
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
            <TableTop tabType={tabType} searchCondition={searchCondition} setSearchCondition={setSearchCondition} tableTopInfo={tableTopInfo} setTabSearchDateInfo={setTabSearchDateInfo} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <CalculateTableHeader width={width} thInfo={thInfo} tdInfo={tdInfo} />
                <tbody>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail', e)}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                            <TableList tabType={tabType} fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} tableTopInfo={tableTopInfo} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={`제휴사 ${isCoupon ? '쿠폰' : '포인트'} 결제내역`} />
        </>
    );
}

export default CalculateAffiliateDetailTable;

interface TableTopProps {
    tabType: AffilateTabType,
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    tableTopInfo: TableTopInfo,
    setTabSearchDateInfo: React.Dispatch<React.SetStateAction<TabSearchDateInfo>>,
};
const TableTop: FC<TableTopProps> = ({ tabType, searchCondition, setSearchCondition, tableTopInfo, setTabSearchDateInfo }) => {

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
                dateTitle={'상세 내역'}
                dateType={'yyyy-MM-dd'}
                searchInfo={searchCondition}
                setSearchInfo={setSearchCondition}
                handleSearch={handleSearch}
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
    tabType: AffilateTabType,
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
};
const TableList: FC<TableListProps> = ({ tabType, fCode, staffNo, searchCondition, tableTopInfo, setTableTopInfo, pageInfo, setPageInfo }) => {

    const { from, to, searchTrigger } = searchCondition;
    const fromDate = Utils.converDateFormat(from, '-');
    const toDate = Utils.converDateFormat(to, '-');

    // eslint-disable-next-line
    const listQueryKey = useMemo(() => ['calculateAffiliateDetail', JSON.stringify({ tabType, fCode, staffNo, fromDate, toDate })], [fCode, staffNo, searchTrigger, tabType]);
    // Query
    const { data: affiliateDetailList } = CALCULATE_SERVICE.useCalculateAffiliateDetailList(listQueryKey, tabType, fCode, staffNo, fromDate, toDate);

    // Table render Node 필터링, 클레임 보상 쿠폰 합계 계산
    const [renderTableList, totalSumObj] = useMemo(() => {

        const sumObj = Object.entries(tableTopInfo.totalObj).reduce((arr, cur) => {
            arr[cur[0] as SumList[number]['type']] = { ...cur[1], title: cur[1].title, sum: 0 };

            return arr;
        }, {} as TotalList);

        // 필터링 된 Table List 생성
        const tableList = affiliateDetailList?.reduce((arr, affiliateDetail, index) => {

            // 합계 계산
            sumObj[SUM_TYPE.USE].sum += affiliateDetail.apply_charge;


            arr.push(
                <tr key={index}>
                    <td className="align-left">{affiliateDetail.use_date.substring(0, 10)}</td>
                    <td className="align-left">{affiliateDetail.coupon_title}</td>
                    <td className="align-center">{affiliateDetail.publisher}</td>
                    <td className="align-center">{affiliateDetail.menu_name}</td>
                    <td className="align-center">{affiliateDetail.phone}</td>
                    <td className="align-right">{Utils.numberComma(affiliateDetail.apply_charge)}</td>
                    <td className="align-right">{Utils.numberComma(affiliateDetail.supply_amt)}</td>
                    <td className="align-right">{Utils.numberComma(affiliateDetail.vat_amt)}</td>
                    <td className="align-right">{Utils.numberComma(affiliateDetail.total_amt)}</td>
                </tr>
            )
            return arr;
        }, [] as ReactNode[]);

        return [tableList, sumObj];
    }, [affiliateDetailList, listQueryKey]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, titleFrom: fromDate, titleTo: toDate, totalObj: totalSumObj }));
        // eslint-disable-next-line
    }, [setTableTopInfo, totalSumObj, affiliateDetailList]);

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

const SUM_TYPE = {
    USE: '사용'
} as const

const SUM_LIST = [
    { title: '제휴사 쿠폰 결제금액(권면금액 기준)', type: SUM_TYPE.USE },
] as const;

type SumList = typeof SUM_LIST;
type TotalList = { [key in SumList[number]['type']]: { title: string, sum: number } };