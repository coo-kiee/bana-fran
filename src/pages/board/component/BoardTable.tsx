import React, { FC } from "react";

// Service
import BOARD_SERVICE from "service/board";

// Type
import { BoardListResult, ListSearchCondition } from "types/board/boardType";
import { DetailInfo } from "..";

// Component
import Pagination from "pages/common/pagination";

interface BoardTableProps {
    listSearchCondition: ListSearchCondition,
    setListSearchCondition: React.Dispatch<React.SetStateAction<ListSearchCondition>>,
    setDetailInfo: React.Dispatch<React.SetStateAction<DetailInfo>>,
};
const BoardTable: FC<BoardTableProps> = ({ listSearchCondition, setListSearchCondition, setDetailInfo }) => {

    const { data: boardList } = BOARD_SERVICE.getBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    const { out: pageInfo } = boardList as BoardListResult || {};

    const { width, headerText } = TABLE_COLUMN_INFO;
    
    return (
        <>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text, index) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    {boardList && <TableList boardList={boardList} boardType={listSearchCondition.board_type} setDetailInfo={setDetailInfo} />}
                </tbody>
            </table>
            <TableBottom dataCnt={pageInfo?.total_cnt || 0} row={listSearchCondition.page_size || 50} currentPage={listSearchCondition.page_idx || 1} setListSearchCondition={setListSearchCondition} />
        </>
    );
}

export default BoardTable;



const TABLE_COLUMN_INFO = {
    width: ['90', '130', '*', '130', '130'],
    headerText: ['번호', '분류', '제목', '첨부파일', '등록일'],
} as const;

interface TableListProps {
    boardList: BoardListResult,
    boardType: number,
    setDetailInfo: React.Dispatch<React.SetStateAction<DetailInfo>>,
};
const TableList: FC<TableListProps> = ({ boardList, boardType, setDetailInfo }) => {

    const { list, out: pageInfo } = boardList;
    const { total_cnt } = pageInfo;

    // 게시글 상세보기로 이동
    const moveToDetail = (boardId: number) => {
        setDetailInfo(prev => ({ ...prev, [boardType]: boardId, isDetail: true }));
    };

    return (
        <>
            {
                list.map((board, index) => {

                    const { category_name, title, attach_cnt, insert_date, rownum, important, board_id } = board;
                    const rowNumInt = total_cnt - parseInt(rownum) + 1;
                    const isEndBoard = index === (total_cnt - 1);
                    const isImportant = important === "1";

                    return (

                        <tr className={isImportant ? "important" : ""} key={rowNumInt} onClick={() => moveToDetail(board_id)}>
                            <td className={isImportant ? "point" : isEndBoard ? 'left-radius' : ""}>{isImportant ? "중요" : rowNumInt}</td>
                            <td>{category_name}</td>
                            <td className="content">{title}</td>
                            <td className={isImportant ? "point" : ""}>{attach_cnt}개</td>
                            <td className={isEndBoard ? 'right-radius' : ""}>{insert_date.substring(0, 10)}</td>
                        </tr>

                    )
                })
            }
            {!!!total_cnt && <tr><td colSpan={TABLE_COLUMN_INFO.width.length}>No Data</td></tr>}
        </>
    )
};

interface TableBottomProps {
    dataCnt: number,
    currentPage: number,
    row: number,
    setListSearchCondition: React.Dispatch<React.SetStateAction<ListSearchCondition>>,
};
const TableBottom: FC<TableBottomProps> = ({ dataCnt, currentPage, row, setListSearchCondition }) => {

    const handlePageChange = (changePage: number) => {
        setListSearchCondition(prev => ({ ...prev, page_idx: changePage }))
    };

    const handlePageRow = (row: number) => {
        setListSearchCondition(prev => ({ ...prev, page_size: row }))
    };

    return (
        <>
            {
                !!dataCnt &&
                <div className="result-function-wrap">
                    <Pagination dataCnt={dataCnt} handlePageChange={handlePageChange} handlePageRow={handlePageRow} pageInfo={{ currentPage, row }} />
                </div>
            }
        </>
    )
}