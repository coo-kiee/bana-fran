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
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

interface EtcDetailTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const EtcDetailTable: FC<EtcDetailTableProps> = ({ userInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // defalt Date
    const today = new Date();
    const lastMonthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEndDate = new Date(today.getFullYear(), today.getMonth(), 0);

       
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        isSearch: false, 
        fromDate: Utils.converDateFormat(lastMonthStartDate, '-'),
        toDate: Utils.converDateFormat(lastMonthEndDate, '-'),
        pointType: 0,
        deviceType: 0,
    });
    const [searchControll, setSearchControll] = useState<SearchControll>({ isSearch: false, titleFromDate: searchCondition.fromDate, titleToDate: searchCondition.toDate });

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;
    const tableRef = useRef<HTMLTableElement | null>(null);

    return (
        <>
            <TableTop lastMonthEndDate={lastMonthEndDate} searchCondition={searchCondition} setSearchCondition={setSearchCondition} searchControll={searchControll} setSearchControll={setSearchControll} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{thInfo.map((th, index) => <th key={index} className={th.className} colSpan={th.colSpan} rowSpan={th.rowSpan} >{th.text}</th>)}</tr>
                    <tr>{tdInfo.map((text, index) => <th key={index} className="price-area" >{text}</th>)}</tr>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('EtcDetail')}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
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

export default EtcDetailTable;




const TABLE_COLUMN_INFO = {
    width: ['128', '68', '*', '130', '130', '130'],
    thInfo: [
        { text: '발행일시\nTT', rowSpan: 2, colSpan: 1, className: '' },
        { text: '구분', rowSpan: 2, colSpan: 1, className: '' },
        { text: '내용', rowSpan: 2, colSpan: 1, className: '' },
        { text: '기타 정산 금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
} as const;

type SearchCondition = {
    isSearch: boolean,
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
    lastMonthEndDate:Date,
    searchCondition: SearchCondition,
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>,
    searchControll: SearchControll,
    setSearchControll: React.Dispatch<React.SetStateAction<SearchControll>>,
};
const TableTop: FC<TableTopProps> = ({ lastMonthEndDate, searchCondition, setSearchCondition, searchControll, setSearchControll }) => {

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
                            <li>청구 금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                            <li>보전 금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
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
    searchControll: SearchControll,
    setSearchControll: React.Dispatch<React.SetStateAction<SearchControll>>,
};
const TableList: FC<TableListProps> = ({ searchCondition, searchControll, setSearchControll }) => {

    // const { list, out: pageInfo } = boardList;
    // const { total_cnt } = pageInfo;

    return (
        <>
            <tr>
                <td className="align-center">2022/03/01</td>
                <td className="align-center">청구</td>
                <td className="align-left">2022/1/1일에 발생한 고객 노트북 도난 사건에 대한 법률 지원 비용</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            <tr>
                <td className="align-center">2022/03/01</td>
                <td className="align-center">청구</td>
                <td className="align-left">2022/1/1일에 발생한 고객 노트북 도난 사건에 대한 법률 지원 비용</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            <tr>
                <td className="align-center">2022/03/01</td>
                <td className="align-center">청구</td>
                <td className="align-left">2022/1/1일에 발생한 고객 노트북 도난 사건에 대한 법률 지원 비용</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
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
                // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
                sheetName: '', // 시트이름, 필수 X
            };

            const fileName = `${titleFromDate}~${titleToDate}_${fCodeName}_본사_쿠폰_결제내역`;

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