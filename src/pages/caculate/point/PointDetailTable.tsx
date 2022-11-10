/* eslint-disable */
import { FC } from "react";

// Component
import Pagination from "pages/common/pagination";

interface PointDetailTableProps {
};
const PointDetailTable: FC<PointDetailTableProps> = ({ }) => {

    // const { data: boardList } = BOARD_SERVICE.useBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    // const { out: pageInfo } = boardList as BoardListResult || {};

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;

    return (
        <>
            <TableTop />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{thInfo.map((th, index) => <th key={index} className={th.className} colSpan={th.colSpan} rowSpan={th.rowSpan} >{th.text}</th>)}</tr>
                    <tr>{tdInfo.map((text, index) => <th key={index} className="price-area" >{text}</th>)}</tr>
                    {/* List */}
                    <TableList />
                </tbody>
            </table>
            < TableBottom />
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
        { text: '유상포인트 결제금액', rowSpan: 1, colSpan: 8, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '합계', '비고']
} as const;

interface TableTopProps {

};
const TableTop: FC<TableTopProps> = ({ }) => {

    return (
        <>
            <p className="title bullet">상세내역</p>
            <div className="search-wrap">
                <div className="input-wrap">
                    <input type="text" placeholder="2022-03-01" />
                    <i>~</i>
                    <input type="text" placeholder="2022-03-30" />
                </div>
                <div className="select-wrap">
                    <select name="" id="">
                        <option value="">포인트 구분 전체</option>
                    </select>
                    <select name="" id="">
                        <option value="">거래기기 전체</option>
                    </select>
                </div>
                <button className="btn-search">조회</button>
            </div>
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                </div>
                <ul className="search-result">
                    <li>충전포인트 사용금액 합계 : <span className="value">10,000원</span></li>
                    <li>잔돈포인트 사용금액 합계 : <span className="value">10,000원</span></li>
                    <li>유상(충전+잔돈)포인트 사용금액 합계:<span className="value">10,000원</span></li>
                </ul>
            </div>
        </>
    )
};

interface TableListProps {
};
const TableList: FC<TableListProps> = ({ }) => {

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
    dataCnt: number,
    currentPage: number,
    row: number,
};
// const TableBottom: FC<TableBottomProps> = ({ dataCnt, currentPage, row }) => {
const TableBottom = () => {

    const { dataCnt = 1, currentPage = 1, row = 50 } = {};
    const handlePageChange = (changePage: number) => {
        // setListSearchCondition(prev => ({ ...prev, page_idx: changePage }))
    };

    const handlePageRow = (row: number) => {
        // setListSearchCondition(prev => ({ ...prev, page_size: row }))
    };

    return (
        <>
            {
                !!dataCnt &&
                <>
                    <div className="result-function-wrap" >
                        <div className="function">
                            <button className="goast-btn">엑셀다운</button>&nbsp;
                        </div>
                        <Pagination dataCnt={dataCnt} handlePageChange={handlePageChange} handlePageRow={handlePageRow} pageInfo={{ currentPage, row }} />
                    </div>
                </>
            }
        </>
    )
}