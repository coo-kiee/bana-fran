import { FC, Suspense, useRef, useState } from "react";
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
import { CustomErrorComponent } from "pages/calculate/list/CalculateListTable";

interface PointDetailTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const PointDetailTable: FC<PointDetailTableProps> = ({ userInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;
    
    // defalt Date
    const today = new Date();
    const lastMonthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 2);
    const lastMonthEndDate = new Date(today.getFullYear(), today.getMonth());
    
    const initialDate = {
        fromDate: Utils.converDateFormat(lastMonthStartDate, '-'),
        toDate: Utils.converDateFormat(lastMonthEndDate, '-'),
        pointType: 0,
        deviceType: 0,
    };
    const [searchCondition, setSearchCondition] = useState<SearchCondition>(initialDate);
    const [searchControll, setSearchControll] = useState<SearchControll>({ isSearch: false, titleFromDate: searchCondition.fromDate, titleToDate: searchCondition.toDate });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null);

    return (
        <>
            <TableTop searchCondition={searchCondition} setSearchCondition={setSearchCondition} searchControll={searchControll} setSearchControll={setSearchControll} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{thInfo.map((th, index) => <th key={index} className={th.className} colSpan={th.colSpan} rowSpan={th.rowSpan} >{th.text}</th>)}</tr>
                    <tr>{tdInfo.map((text, index) => <th key={index} className="price-area" >{text}</th>)}</tr>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <CustomErrorComponent resetErrorBoundary={resetErrorBoundary} colsPan={TABLE_COLUMN_INFO.width.length} />} onError={(e) => console.log('CouponDetail')}>
                        <Suspense fallback={<tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} style={{ background: '#fff' }}><Loading height={80} width={80} marginTop={-50} /></td></tr>}>
                            <TableList fCode={f_code} staffNo={staff_no} searchCondition={searchCondition} searchControll={searchControll} setSearchControll={setSearchControll} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            < TableBottom fCodeName={f_code_name} tableRef={tableRef} searchControll={searchControll} />
            {/* <TableBottom dataCnt={pageInfo?.total_cnt || 0} row={listSearchCondition.page_size || 50} currentPage={listSearchCondition.page_idx || 1} setListSearchCondition={setListSearchCondition} /> */}
        </>
    );
}

export default PointDetailTable;




const TABLE_COLUMN_INFO = {
    width: ['188', '393', '136', '125', '160', '134', '92', '131', '131', '131'],
    thInfo: [
        { text: '결제일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '주문메뉴', rowSpan: 2, colSpan: 1, className: '' },
        { text: '주문자', rowSpan: 2, colSpan: 1, className: '' },
        { text: '총 주문금액', rowSpan: 2, colSpan: 1, className: '' },
        { text: '유상포인트 사용금액', rowSpan: 2, colSpan: 1, className: '' },
        { text: '유상포인트 구분', rowSpan: 2, colSpan: 1, className: '' },
        { text: '거래기기', rowSpan: 2, colSpan: 1, className: '' },
        { text: '유상포인트 결제금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '합계', '비고']
} as const;

type SearchCondition = {
    fromDate: string,
    toDate: string,
    pointType: number,
    deviceType: number,
};

type SearchControll = {
    isSearch: boolean,
    titleFromDate: string,
    titleToDate: string,
};

interface TableTopProps {
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    searchControll: SearchControll,
    setSearchControll: React.Dispatch<React.SetStateAction<SearchControll>>,
};
const TableTop: FC<TableTopProps> = ({ searchCondition, setSearchCondition, searchControll, setSearchControll }) => {
    
    const { fromDate, toDate, pointType, deviceType } = searchCondition;
    const { isSearch, titleFromDate, titleToDate } = searchControll;

    const handleSearchCondition = (key: string, value: any) => {
        setSearchCondition(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        setSearchControll(prev => ({ ...prev, isSearch: true }));
    };

    return (
        <>
            <p className="title bullet">상세내역</p>
            <div className="search-wrap">
                <div className="input-wrap">
                    <ReactDatePicker
                        dateFormat={'yyyy-MM-dd'}
                        selected={new Date(fromDate)}
                        onChange={(date) => handleSearchCondition('fromDate', Utils.converDateFormat(date, '-'))}
                        maxDate={new Date()}
                        locale={ko}
                    />
                    <i>~</i>
                    <ReactDatePicker
                        dateFormat={'yyyy-MM-dd'}
                        selected={new Date(toDate)}
                        onChange={(date) => handleSearchCondition('toDate', Utils.converDateFormat(date, '-'))}
                        maxDate={new Date()}
                        locale={ko}
                    />
                </div>
                <div className="select-wrap">
                    <select name="pointType" id="" value={pointType} onChange={(e) => handleSearchCondition(e.currentTarget.name, e.currentTarget.value)} >
                        <option value={0}>포인트 구분 전체</option>
                    </select>&nbsp;&nbsp;
                    <select name="deviceType" id="" value={deviceType} onChange={(e) => handleSearchCondition(e.currentTarget.name, e.currentTarget.value)} >
                        <option value={0}>거래기기 전체</option>
                        <option value={1}>포인트 구분 전체</option>
                    </select>
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
                            <li>충전포인트 사용금액 합계 : <span className="value">10,000원</span></li>
                            <li>잔돈포인트 사용금액 합계 : <span className="value">10,000원</span></li>
                            <li>유상(충전+잔돈)포인트 사용금액 합계:<span className="value">10,000원</span></li>
                        </ul>
                    </>
                }
            </div>
        </>
    )
};

interface TableListProps {
    fCode:number,
    staffNo:number,
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
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-left">아메리카노 외 1건</td>
                <td className="align-center">0101234****</td>
                <td className="align-right">13,000</td>
                <td className="align-right">13,000</td>
                <td className="align-center">충전포인트</td>
                <td className="align-center">어플</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
            </tr>
            <tr>
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-left">아메리카노 외 1건</td>
                <td className="align-center">0101234****</td>
                <td className="align-right">13,000</td>
                <td className="align-right">13,000</td>
                <td className="align-center">충전포인트</td>
                <td className="align-center">어플</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
            </tr>
            <tr>
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-left">아메리카노 외 1건</td>
                <td className="align-center">0101234****</td>
                <td className="align-right">13,000</td>
                <td className="align-right">13,000</td>
                <td className="align-center">충전포인트</td>
                <td className="align-center">어플</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
            </tr>
            {/* {!!!total_cnt && <tr><td colSpan={TABLE_COLUMN_INFO.width.length}>No Data</td></tr>} */}
            {/* <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >No Data</td></tr> */}
        </>
    )
};

interface TableBottomProps {
    fCodeName:string,
    dataCnt: number,
    currentPage: number,
    row: number,
    searchControll: SearchControll,
    tableRef: React.MutableRefObject<HTMLTableElement | null>,
};
// const TableBottom: FC<TableBottomProps> = ({ fCodeName, dataCnt, currentPage, row, searchControll, tableRef }) => {
const TableBottom: FC<{ fCodeName:string, searchControll: SearchControll, tableRef: React.MutableRefObject<HTMLTableElement | null>, }> = ({ fCodeName, searchControll, tableRef }) => {

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
                // sheetOption: { origin: "B3", outline: { above: true } }, // 해당 셀부터 데이터 표시, 세부정보 아래 요약행, 필수 X
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: TABLE_COLUMN_INFO.width.map(wpx => ({ wpx: parseInt(wpx) * 1.2 })), // 셀 너비 설정, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
                // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
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
                            <button className="goast-btn" onClick={excelDownload}>엑셀다운</button>&nbsp;
                        </div>
                        <Pagination dataCnt={dataCnt} handlePageChange={handlePageChange} handlePageRow={handlePageRow} pageInfo={{ currentPage, row }} />
                    </div>
                </>
            }
        </>
    )
}