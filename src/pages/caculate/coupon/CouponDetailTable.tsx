/* eslint-disable */
import { FC } from "react";

// Component
import Pagination from "pages/common/pagination";

interface CouponDetailTableProps {
};
const CouponDetailTable: FC<CouponDetailTableProps> = ({ }) => {

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

export default CouponDetailTable;




const TABLE_COLUMN_INFO = {
    width: ['188', '393', '262', '116', '134', '136', '136', '136', '136'],
    thInfo: [
        { text: '결제일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '쿠폰', rowSpan: 2, colSpan: 1, className: '' },
        { text: '사용메뉴', rowSpan: 2, colSpan: 1, className: '' },
        { text: '쿠폰 사용금액', rowSpan: 2, colSpan: 1, className: '' },
        { text: '거래기기', rowSpan: 2, colSpan: 1, className: '' },
        { text: '주문자', rowSpan: 2, colSpan: 1, className: '' },
        { text: '본사발행 쿠폰 결제내역', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    ],
    tdInfo: ['공급가', '부가세', '합계']
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
                    <li>출석 이벤트 쿠폰&nbsp;:&nbsp;<span className="value">10,000원</span></li>
                    <li>밀크티 트립 스탬프 이벤트 쿠폰&nbsp;:&nbsp;<span className="value">10,000원</span></li>
                    <li>어플 설치 1500원 할인 쿠폰:<span className="value">10,000원</span></li>
                    <li>고객 클레임 서비스 쿠폰:<span className="value">10,000원</span></li>
                    <li>기타 본사 서비스 쿠폰:<span className="value">10,000원</span></li>
                    <li>본사 쿠폰 사용금액 합계:<span className="value">10,000원</span></li>
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
                <td className="align-left">출석 이벤트 쿠폰</td>
                <td className="align-left">아메리카노</td>
                <td className="align-right">13,000</td>
                <td className="align-center">어플</td>
                <td className="align-center">0101234****</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            <tr>
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-left">밀크티 트립 스탬프 이벤트 쿠폰</td>
                <td className="align-left">아메리카노</td>
                <td className="align-right">13,000</td>
                <td className="align-center">어플</td>
                <td className="align-center">0101234****</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
            <tr>
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-left">어플 설치 1500원 할인 쿠폰</td>
                <td className="align-left">아메리카노</td>
                <td className="align-right">13,000</td>
                <td className="align-center">키오스크</td>
                <td className="align-center">0101234****</td>
                <td className="align-right">130,000</td>
                <td className="align-right">130,000</td>
                <td className="align-right"><strong>130,000</strong></td>
            </tr>
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