import { FC, ReactNode, Suspense, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// DatePicker
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";


// Util
import Utils from "utils/Utils";

// Component
import Pagination from "pages/common/pagination";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

interface ClaimDetailTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const ClaimDetailTable: FC<ClaimDetailTableProps> = ({ userInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // defalt Date
    const today = new Date();
    const lastMonthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEndDate = new Date(today.getFullYear(), today.getMonth(), 0);

    const initialDate = {
        fromDate: Utils.converDateFormat(lastMonthStartDate, '-'),
        toDate: Utils.converDateFormat(lastMonthEndDate, '-'),
    };
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        isSearch: false, 
        fromDate: Utils.converDateFormat(lastMonthStartDate, '-'),
        toDate: Utils.converDateFormat(lastMonthEndDate, '-'),
    });
    const [searchControll, setSearchControll] = useState<SearchControll>({ isSearch: false, titleFromDate: searchCondition.fromDate, titleToDate: searchCondition.toDate });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null);

    return (
        <>
            <TableWrap lastMonthEndDate={lastMonthEndDate} searchCondition={searchCondition} setSearchCondition={setSearchCondition} searchControll={searchControll} setSearchControll={setSearchControll} >
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                    {/* Column Width */}
                    <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                    <tbody>
                        {/* Table Header  */}
                        <tr style={{ whiteSpace: 'pre-line' }}>{thInfo.map((th, index) => <th key={index} className={th.className} colSpan={th.colSpan} rowSpan={th.rowSpan} >{th.text}</th>)}</tr>
                        <tr>{tdInfo.map((text, index) => <th key={index} className="price-area" >{text}</th>)}</tr>
                        {/* List */}
                        <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail')}>
                            <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                                <TableList fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} searchControll={searchControll} setSearchControll={setSearchControll} />
                            </Suspense>
                        </ErrorBoundary>
                    </tbody>
                </table>
            </TableWrap>
            < TableBottom fCodeName={f_code_name} tableRef={tableRef} searchControll={searchControll} />
            {/* <TableBottom dataCnt={pageInfo?.total_cnt || 0} row={listSearchCondition.page_size || 50} currentPage={listSearchCondition.page_idx || 1} setListSearchCondition={setListSearchCondition} /> */}
        </>
    );
}

export default ClaimDetailTable;




const TABLE_COLUMN_INFO = {
    width: ['130', '130', '88', '150', '109', '130', '136', '*', '92', '130', '130', '130'],
    thInfo: [
        { text: '쿠폰 발행일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '쿠폰 사용일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '사용여부', rowSpan: 2, colSpan: 1, className: '' },
        { text: '쿠폰명', rowSpan: 2, colSpan: 1, className: '' },
        { text: `쿠폰발행\n(최대)금액`, rowSpan: 2, colSpan: 1, className: '' },
        { text: '유효기간', rowSpan: 2, colSpan: 1, className: '' },
        { text: '발급고객', rowSpan: 2, colSpan: 1, className: '' },
        { text: '클레임 내용', rowSpan: 2, colSpan: 1, className: '' },
        { text: '사용매장', rowSpan: 2, colSpan: 1, className: '' },
        { text: '본사발행 쿠폰 결제내역', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
} as const;

type SearchCondition = {
    isSearch: boolean,
    fromDate: string,
    toDate: string,
};

type SearchControll = {
    isSearch: boolean,
    titleFromDate: string,
    titleToDate: string,
};

interface TableWrapProps {
    children: ReactNode,
    lastMonthEndDate: Date,
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    searchControll: SearchControll,
    setSearchControll: React.Dispatch<React.SetStateAction<SearchControll>>,
};
const TableWrap: FC<TableWrapProps> = ({ children, lastMonthEndDate, searchCondition, setSearchCondition, searchControll, setSearchControll }) => {

    const { fromDate, toDate } = searchCondition;
    const { isSearch, titleFromDate, titleToDate } = searchControll;

    const handleSearchCondition = (key: string, value: any) => {
        setSearchCondition(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        setSearchControll(prev => ({ ...prev, isSearch: true }));
    };

    return (
        <>
            <ClaimTab />
            <div id="tab1" className="tab-content active">
                <div className="search-wrap">
                    <p className="title">발생일시</p>
                    <div className="input-wrap">
                        <ReactDatePicker
                            dateFormat={'yyyy-MM-dd'}
                            selected={new Date(fromDate)}
                            onChange={(date) => handleSearchCondition('fromDate', Utils.converDateFormat(date, '-'))}
                            maxDate={lastMonthEndDate}
                            locale={ko}
                        />
                        <i>~</i>
                        <ReactDatePicker
                            dateFormat={'yyyy-MM-dd'}
                            selected={new Date(toDate)}
                            onChange={(date) => handleSearchCondition('toDate', Utils.converDateFormat(date, '-'))}
                            maxDate={lastMonthEndDate}
                            locale={ko}
                        />
                    </div>
                    <button className="btn-search" onClick={handleSearch}>조회</button>
                </div>
                <div className="search-result-wrap">
                    {
                        !isSearch &&
                        <>
                            <div className="search-date">
                                <p>조회기간: {titleFromDate} ~ {titleToDate}</p>
                            </div>
                            <ul className="search-result">
                                <li>클레임 보상 쿠폰 발행금액 합계&nbsp;:&nbsp;<span className="value">10,000원</span></li>
                                <li>클레임 보상 쿠폰 만료금액 합계&nbsp;:&nbsp;<span className="value">10,000원</span></li>
                                <li>클레임 보상 쿠폰 사용금액 합계&nbsp;:&nbsp;<span className="value">20,000원</span></li>
                            </ul>
                        </>
                    }
                </div>
                {children}
            </div>
        </>
    )
};

const ClaimTab: FC = () => {

    return (
        <ul className="tab-wrap">
            <li className="tab active" data-tab="tab1">클레임 내역전체</li>
            <li className="tab" data-tab="tab2">정산 내역 조회</li>
        </ul>
    );
}

interface TableListProps {
    fCode: number,
    staffNo: number,
    searchCondition: SearchCondition,
    searchControll: SearchControll,
    setSearchControll: React.Dispatch<React.SetStateAction<SearchControll>>,
};
const TableList: FC<TableListProps> = ({ searchCondition, searchControll, setSearchControll }) => {

    // const { list, out: pageInfo } = boardList;
    // const { total_cnt } = pageInfo;

    return (
        <>
            <tr>
                <td className="align-center">2022-09-20 14:46:00</td>
                <td className="align-center">2022-09-2014:46:00</td>
                <td className="align-center">미사용</td>
                <td className="align-center">고객 서비스 쿠폰</td>
                <td className="align-right">5,000</td>
                <td className="align-center">2021-11-30</td>
                <td className="align-center">0101234****</td>
                <td className="align-left">알바 직원이 음료를 쏟음</td>
                <td className="align-center">삼성점</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            <tr>
                <td className="align-center">2022-09-20 14:46:00</td>
                <td className="align-center">2022-09-2014:46:00</td>
                <td className="align-center">미사용</td>
                <td className="align-center">고객 서비스 쿠폰</td>
                <td className="align-right">5,000</td>
                <td className="align-center">2021-11-30</td>
                <td className="align-center">0101234****</td>
                <td className="align-left">알바 직원이 음료를 쏟음</td>
                <td className="align-center">삼성점</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            <tr>
                <td className="align-center">2022-09-20 14:46:00</td>
                <td className="align-center">2022-09-2014:46:00</td>
                <td className="align-center">미사용</td>
                <td className="align-center">고객 서비스 쿠폰</td>
                <td className="align-right">5,000</td>
                <td className="align-center">2021-11-30</td>
                <td className="align-center">0101234****</td>
                <td className="align-left">알바 직원이 음료를 쏟음</td>
                <td className="align-center">삼성점</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            {/* {!!!total_cnt && <tr><td colSpan={TABLE_COLUMN_INFO.width.length}>No Data</td></tr>} */}
            {/* <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >No Data</td></tr> */}
        </>
    )
};

interface TableBottomProps {
    fCodeName: string,
    dataCnt: number,
    currentPage: number,
    row: number,
    searchControll: SearchControll,
    tableRef: React.MutableRefObject<HTMLTableElement | null>,
};
// const TableBottom: FC<TableBottomProps> = ({ fCodeName, dataCnt, currentPage, row, searchControll, tableRef }) => {
const TableBottom: FC<{ fCodeName: string, searchControll: SearchControll, tableRef: React.MutableRefObject<HTMLTableElement | null>, }> = ({ fCodeName, searchControll, tableRef }) => {

    const { dataCnt = 1, currentPage = 1, row = 50 } = {};
    const { titleFromDate, titleToDate } = searchControll;
    const handlePageChange = (changePage: number) => {
        // setListSearchCondition(prev => ({ ...prev, page_idx: changePage }))
    };

    const handlePageRow = (row: number) => {
        // setListSearchCondition(prev => ({ ...prev, page_size: row }))
    };

    const excelDownload = () => {
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: TABLE_COLUMN_INFO.width.map(wpx => ({ wpx: parseInt(wpx) * 1.2 })), // 셀 너비 설정, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
                addLineHeader: ['쿠폰발행\n(최대)금액'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
                sheetName: '', // 시트이름, 필수 X
            };

            const fileName = `${titleFromDate}~${titleToDate}_${fCodeName}_유상포인트_결제내역`;

            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };

    return (
        <>
            {
                !!dataCnt &&
                <>
                    <div className="result-function-wrap" >
                        <div className="function">
                            <button className="goast-btn" onClick={excelDownload}>엑셀다운</button>
                        </div>
                        <Pagination dataCnt={dataCnt} handlePageChange={handlePageChange} handlePageRow={handlePageRow} pageInfo={{ currentPage, row }} />
                    </div>
                </>
            }
        </>
    )
}