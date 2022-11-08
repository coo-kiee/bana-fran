/* eslint-disable */
import { FC, useRef } from "react";

// Component
import Pagination from "pages/common/pagination";
import Utils from "utils/Utils";

interface EtcDetailTableProps {
};
const EtcDetailTable: FC<EtcDetailTableProps> = ({ }) => {

    // const { data: boardList } = BOARD_SERVICE.useBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    // const { out: pageInfo } = boardList as BoardListResult || {};

    const { width, thInfo, tdInfo } = TABLE_COLUMN_INFO;

    const test = useRef<null | HTMLTableElement>(null);
    const testExcel = () => {
        if (test.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: TABLE_COLUMN_INFO.width.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                header: { checkHeader: [...TABLE_COLUMN_INFO.tdInfo, ...TABLE_COLUMN_INFO.thInfo.map(item => item.text)], color: 'd3d3d3' }, // 헤더 색상 넣을 때 필요(rgb #빼고 입력), 필수 X
                addRowColor: { rowNum: 3, rowColor: 'd3d3d3' }, // 추가적으로 색상 넣을 행(rgb #빼고 입력), 필수 X
                sheetName: 'test', // 시트이름, 필수 X
            };
            
            try {
                Utils.excelDownload(test.current, options, 'test');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            <TableTop />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={test}>
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
            < TableBottom testExcel={testExcel}/>
            {/* <TableBottom dataCnt={pageInfo?.total_cnt || 0} row={listSearchCondition.page_size || 50} currentPage={listSearchCondition.page_idx || 1} setListSearchCondition={setListSearchCondition} /> */}
        </>
    );
}

export default EtcDetailTable;




const TABLE_COLUMN_INFO = {
    width: ['128', '68', '*', '130', '130', '130'],
    thInfo: [
        { text: '발행일시', rowSpan: 2, colSpan: 1, className: '' },
        { text: '구분', rowSpan: 2, colSpan: 1, className: '' },
        { text: '내용', rowSpan: 2, colSpan: 1, className: '' },
        { text: '기타 정산 금액', rowSpan: 1, colSpan: 3, className: 'price-area' },
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
            {
                // list.map((board, index) => {

                //     const { category_name, title, attach_cnt, insert_date, rownum, important, board_id } = board;
                //     const rowNumInt = total_cnt - parseInt(rownum) + 1;
                //     const isEndBoard = index === (total_cnt - 1);
                //     const isImportant = important === "1";

                //     return (
                //         <tr className={isImportant ? "important" : ""} key={rowNumInt} >
                //             <td className={isImportant ? "point" : isEndBoard ? 'left-radius' : ""}>{isImportant ? "중요" : rowNumInt}</td>
                //             <td>{category_name}</td>
                //             <td className="content">{title}</td>
                //             <td className={isImportant ? "point" : ""}>{attach_cnt}개</td>
                //             <td className={isEndBoard ? 'right-radius' : ""}>{insert_date.substring(0, 10)}</td>
                //         </tr>
                //     )
                // })
            }
            {/* {!!!total_cnt && <tr><td colSpan={TABLE_COLUMN_INFO.width.length}>No Data</td></tr>} */}
            {/* <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >No Data</td></tr> */}
            <tr>
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-center">청구</td>
                <td className="align-left">유상포인트(충전/잔돈포인트)의 고객 사용비용 보전</td>
                <td className="align-right">117,000</td>
                <td className="align-right">13,000</td>
                <td className="align-right">130,000</td>
            </tr>
            <tr>
                <td className="align-center total">22/06/01~22/06/30</td>
                <td className="align-center total" colSpan={2}>총 합계</td>
                <td className="align-right total">117,000</td>
                <td className="align-right total">13,000</td>
                <td className="align-right total">130,000</td>
            </tr>
        </>
    )
};

interface TableBottomProps {
    // dataCnt: number,
    // currentPage: number,
    // row: number,
    testExcel: () => void,
};
// const TableBottom: FC<TableBottomProps> = ({ dataCnt, currentPage, row }) => {
const TableBottom:FC<TableBottomProps> = ({testExcel}) => {

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
                            <button className="goast-btn" onClick={testExcel}>엑셀다운</button>&nbsp;
                        </div>
                        <Pagination dataCnt={dataCnt} handlePageChange={handlePageChange} handlePageRow={handlePageRow} pageInfo={{ currentPage, row }} />
                    </div>
                </>
            }
        </>
    )
}