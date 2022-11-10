/* eslint-disable */
import { FC, ReactNode } from "react";

// Component
import Pagination from "pages/common/pagination";

interface ClaimDetailTableProps {
};
const ClaimDetailTable: FC<ClaimDetailTableProps> = ({ }) => {

    // const { data: boardList } = BOARD_SERVICE.useBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    // const { out: pageInfo } = boardList as BoardListResult || {};

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;

    return (
        <>
            <TableTop >
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
            </TableTop>
            < TableBottom />
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
        { text: `쿠폰발행${<br />}(최대)금액`, rowSpan: 2, colSpan: 1, className: '' },
        { text: '유효기간', rowSpan: 2, colSpan: 1, className: '' },
        { text: '발급고객', rowSpan: 2, colSpan: 1, className: '' },
        { text: '클레임 내용', rowSpan: 2, colSpan: 1, className: '' },
        { text: '사용매장', rowSpan: 2, colSpan: 1, className: '' },
        { text: '본사발행 쿠폰 결제내역', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
} as const;

interface TableTopProps {
    children: ReactNode,
};
const TableTop: FC<TableTopProps> = ({ children }) => {

    return (
        <>
            <ClaimTab />
            <div id="tab1" className="tab-content active">
                <div className="search-wrap">
                    <p className="title">발생일시</p>
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <button className="btn-search">조회</button>
                </div>
                <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li>클레임 보상 쿠폰 발행금액 합계&nbsp;:&nbsp;<span className="value">10,000원</span></li>
                        <li>클레임 보상 쿠폰 만료금액 합계&nbsp;:&nbsp;<span className="value">10,000원</span></li>
                        <li>클레임 보상 쿠폰 사용금액 합계&nbsp;:&nbsp;<span className="value">20,000원</span></li>
                    </ul>
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
};
const TableList: FC<TableListProps> = ({ }) => {

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