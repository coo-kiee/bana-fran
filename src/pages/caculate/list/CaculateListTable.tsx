/* eslint-disable */
import { FC } from "react";

interface CaculateListTableProps {
    handlePopup: (key: string, value: boolean) => void
};
const CaculateListTable: FC<CaculateListTableProps> = ({ handlePopup }) => {

    // const { data: boardList } = BOARD_SERVICE.getBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    // const { out: pageInfo } = boardList as BoardListResult || {};

    const { width, headerText } = TABLE_COLUMN_INFO;

    return (
        <>
            <TableTop handlePopup={handlePopup} />
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    <TableList />
                </tbody>
            </table>
            < TableBottom />
            {/* <TableBottom dataCnt={pageInfo?.total_cnt || 0} row={listSearchCondition.page_size || 50} currentPage={listSearchCondition.page_idx || 1} setListSearchCondition={setListSearchCondition} /> */}
        </>
    );
}

export default CaculateListTable;




const TABLE_COLUMN_INFO = {
    width: ['188', '70', '130', '*', '130', '130', '130', '130', '130', '130'],
    headerText: ['정산기간', '구분', '품목', '상세내역', '수량', '단가', '공급가액', '부가세', '합계', '비고'],
} as const;

interface TableTopProps {
    handlePopup: (key: string, value: boolean) => void
};
const TableTop: FC<TableTopProps> = ({ handlePopup }) => {

    return (
        <div className="function-wrap">
            <div className="select-wrap">
                <select name="" id="">
                    <option value="">2022-06</option>
                </select>
                <button className="goast-btn">선택</button>
            </div>
            <p className="text-info">※ ‘보전’은 본사로부터 보전받을 금액이며, '청구'는 본사가 가맹점에 청구하는 금액을 의미합니다.</p>
            <div className="btn-wrap">
                {/* <!-- class명 inactive 추가시 비활성화 --> */}
                {/* 데이터 없으면 버튼 비활성화 */} <button className="btn-check">정산확인</button>
                {/* 데이터 없으면 버튼 비활성화 */} <button className="btn-modify-request modify-view" onClick={() => handlePopup('requestModify', true)} >수정요청</button>
                <button className="btn-modify-history history-view" onClick={() => handlePopup('changeHistory', true)} >수정요청/변경이력</button>
            </div>
        </div>
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
            <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >해당 월 정산내역 처리중입니다</td></tr>
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
                            <button className="goast-btn">인쇄</button>
                        </div>
                        <div className="result">
                            합계 :<span>239,200</span>
                        </div>
                    </div>
                </>
            }
        </>
    )
}