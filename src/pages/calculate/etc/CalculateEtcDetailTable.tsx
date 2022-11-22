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
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-01');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        from: fromDate, // 달력 선택 정보
        to: toDate, // 달력 선택 정보
        searchOption: [ETC_TYPE.ALL],  // 필터링 옵션
        searchTrigger: false, // query trigger
    });
    
    const [tableTopInfo, setTableTopInfo] = useState<TableTopInfo>({
        titleFrom: Utils.converDateFormat(searchCondition.from, '-'),
        titleTo: Utils.converDateFormat(searchCondition.to, '-'),
        totalBilling: 0,
        totalConservation: 0,
    });

    const [pageInfo, setPageInfo] = useState({
        dataCnt: 0,
        currentPage: 1,
        row: 50,
    });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null); // 엑셀 다운에 사용

    return (
        <>
            <TableTop searchCondition={searchCondition} setSearchCondition={setSearchCondition} tableTopInfo={tableTopInfo} setTableTopInfo={setTableTopInfo} />
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
                            <TableList fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} setTableTopInfo={setTableTopInfo} pageInfo={pageInfo} setPageInfo={setPageInfo} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <CalculateDetailTableBottom fCodeName={f_code_name} tableRef={tableRef} titleFrom={tableTopInfo.titleFrom} titleTo={tableTopInfo.titleTo} colspan={width} pageInfo={pageInfo} setPageInfo={setPageInfo} excelFileName={'기타_정산_내역'} />
        </>
    );
}

export default CalculateEtcDetailTable;




interface TableTopProps {
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    tableTopInfo: TableTopInfo,
    setTableTopInfo: React.Dispatch<React.SetStateAction<TableTopInfo>>,
};
const TableTop: FC<TableTopProps> = ({ searchCondition, setSearchCondition, tableTopInfo, setTableTopInfo }) => {

    const { titleFrom, titleTo, totalBilling, totalConservation } = tableTopInfo;

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
                selectOption={[ETC_TYPE]} // select로 나타날 옵션 정보
                optionList={[Object.keys(ETC_TYPE)]} // option 맵핑할 때 사용  
                handleSearch={() => { handleSearch() }}
            />
            <div className="search-result-wrap">
                {
                    <>
                        <div className="search-date">
                            <p>조회기간: {titleFrom} ~ {titleTo}</p>
                        </div>
                        <ul className="search-result">
                            <li>청구 금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                            <li>보전 금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                            {/* <li>충전포인트 사용금액 합계 : <span className="value">{Utils.numberComma(totalChargePoint)}원</span></li>
                            <li>잔돈포인트 사용금액 합계 : <span className="value">{Utils.numberComma(totalPointChange)}원</span></li>
                            <li>유상(충전+잔돈)포인트 사용금액 합계 : <span className="value">{Utils.numberComma(totalChargePoint + totalPointChange)}원</span></li> */}
                        </ul>
                    </>
                }
            </div>
        </>
    )
};

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
    const fromDate = Utils.converDateFormat(from, '-');
    const toDate = Utils.converDateFormat(to, '-');

    // eslint-disable-next-line
    const listQueryKey = useMemo(() => ['calculateEtcDetail', JSON.stringify({ fCode, staffNo, fromDate, toDate })], [fCode, staffNo, searchTrigger]);
    const { data: etcDetailList } = CALCULATE_SERVICE.useCalculateEtcDetail(listQueryKey, fCode, staffNo, fromDate, toDate);

    // Table render Node 필터링, 충전/잔돈 포인트 합계 계산
    const [renderTableList, totalBilling, totalConservation] = useMemo(() => {

        let billingSum = 0; // 충전포인트 합계
        let conservationSum = 0; // 잔돈포인트 합계

        // 필터링 된 Table List 생성
        const tableList = etcDetailList?.reduce((arr, etcDetail, index) => {

            const { rcp_date, item_name, phone, nChargeTotal, total_amt, use_point_type, rcp_type, supply_amt, vat_amt } = etcDetail;
            const [date] = rcp_date.split(' '); // [date, time]

            // 합계 계산
            if (use_point_type === ETC_TYPE.BILLING.value) billingSum += total_amt;
            else if (use_point_type === ETC_TYPE.CONSERVATION.value) conservationSum += total_amt;

            // 필터링 조건
            const isPointType = searchOption[0].value === ETC_TYPE.ALL.value || searchOption[0].value === use_point_type;

            if (isPointType) {
                arr.push(
                    <tr key={index}>
                        <td className="align-center">2022/03/01</td>
                        <td className="align-center">청구</td>
                        <td className="align-left">2022/1/1일에 발생한 고객 노트북 도난 사건에 대한 법률 지원 비용</td>
                        <td className="align-right">130,000</td>
                        <td className="align-right">130,000</td>
                        <td className="align-right"><strong>130,000</strong></td>
                    </tr>
                    // <tr key={index}>
                    //     <td className="align-center">{date}</td>
                    //     <td className="align-left">{item_name}</td>
                    //     <td className="align-center">{phone}</td>
                    //     <td className="align-right">{Utils.numberComma(nChargeTotal)}</td>
                    //     <td className="align-right">{Utils.numberComma(total_amt)}</td>
                    //     <td className="align-center">{use_point_type}</td>
                    //     <td className="align-center">{rcp_type}</td>
                    //     <td className="align-right">{Utils.numberComma(supply_amt)}</td>
                    //     <td className="align-right">{Utils.numberComma(vat_amt)}</td>
                    //     <td className="align-right">{Utils.numberComma(total_amt)}</td>
                    // </tr>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        return [tableList, billingSum, conservationSum];
    }, [etcDetailList, searchOption]);

    // 페이지 로딩 && 필터적용 시 페이지 정보 수정
    useEffect(() => {
        if (renderTableList) setPageInfo(prev => ({ ...prev, dataCnt: renderTableList.length, currentPage: 1 }));
    }, [setPageInfo, renderTableList]);

    // 페이지 로딩 시 합계 값 대입
    useEffect(() => {
        setTableTopInfo(prev => ({ ...prev, titleFrom:fromDate, titleTo:toDate, totalBilling, totalConservation }));
        // eslint-disable-next-line
    }, [setTableTopInfo, totalBilling, totalConservation]);

    return (
        <>
            {/* 페이지네이션 적용 */}
            {renderTableList?.map((item, index) => (index >= (currentPage - 1) * row && index < currentPage * row) && item)}
            {renderTableList?.length === 0 && <NoData isTable={true} />}
        </>
    )
};

// Component Type
const TABLE_COLUMN_INFO = {
    width: ['128', '68', '*', '130', '130', '130'],
    thInfo: [
        { text: '발행일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '구분', rowSpan: 2, colSpan: 1, className: '' },
        { text: '내용', rowSpan: 2, colSpan: 1, className: '' },
        { text: '기타 정산 금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
} as const;

// 기타 타입 데이터 불러올 시 - CouponDetailTable.tsx 참고
const ETC_TYPE = {
    ALL: { title: '구분 전체', value: '구분 전체' },
    BILLING: { title: '청구', value: '청구' },
    CONSERVATION: { title: '보전', value: '보전' },
} as const;

interface SearchCondition extends SearchInfoSelectType {
    searchTrigger: boolean,
};

type TableTopInfo = {
    titleFrom: string,
    titleTo: string,
    totalBilling: number,
    totalConservation: number,
};