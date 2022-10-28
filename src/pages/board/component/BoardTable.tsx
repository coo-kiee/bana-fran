import Pagination from "pages/common/pagination";
import React, { FC, useEffect } from "react";
import BOARD_SERVICE from "service/board";
import { BoardListResult, ListSearchCondition } from "types/board/boardType";

interface BoardTableProps {
    listSearchCondition: ListSearchCondition,
    setListSearchCondition: React.Dispatch<React.SetStateAction<ListSearchCondition>>,
};

const BoardTable: FC<BoardTableProps> = ({ listSearchCondition, setListSearchCondition }) => {

    const { data: boardList, isFetching } = BOARD_SERVICE.getBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    // const { attach_cnt, board_id, board_type, category, category_name,
    //     contents_type, delete_flag, important, insert_date, insert_user_name,
    //     modify_date, modify_user_name, new_flag, open_date_flag, open_end_date,
    //     open_flag, open_start_date, read_cnt, read_flag, rownum,
    //     title } = boardList;
    const { out: pageInfo } = boardList as BoardListResult || {};

    // useEffect(() => {
    //     console.log(boardList);
    // }, [boardList]);

    const { width } = TABLE_TITLE;

    return (
        <>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {width.map((wd, index) => <col width={wd} key={index} />)}
                </colgroup>
                {boardList && <TableList boardList={boardList} row={listSearchCondition.page_size} currentPage={listSearchCondition.page_idx} />}
            </table>
            {
                !isFetching &&
                <TableBottom dataCnt={pageInfo.total_cnt} row={listSearchCondition.page_size} currentPage={listSearchCondition.page_idx} setListSearchCondition={setListSearchCondition} />
            }
        </>
    );
}

export default BoardTable;

interface TableListProps {
    boardList: BoardListResult,
    currentPage: number,
    row: number,
};
const TableList: FC<TableListProps> = ({ boardList, currentPage, row }) => {

    const { list, out: pageInfo } = boardList;
    const { total_cnt } = pageInfo;
    const { text } = TABLE_TITLE;

    return (
        <tbody>
            <tr>
                {text.map((text, index) => <th key={index}>{text}</th>)}
            </tr>
            {
                list.map((board, index) => {

                    const { category_name, title, attach_cnt, insert_date, rownum, important } = board;
                    const rowNumInt = total_cnt - parseInt(rownum) + 1;
                    const isEndBoard = index === (total_cnt - 1);
                    const isImportant = important === "1";

                    return (
                        // rowNum이 total - row * (currentPage - 1) 보다 같거나 작고, total - row * currentPage 보다 크면 출력;
                        (rowNumInt <= total_cnt - row * (currentPage - 1) && rowNumInt > (total_cnt - row * currentPage)) &&
                        <tr className={isImportant ? "important" : ""} key={rowNumInt}>
                            <td className={isImportant ? "point" : isEndBoard ? 'left-radius' : ""}>{isImportant ? "중요" : rowNumInt}</td>
                            <td>{category_name}</td>
                            <td className="content">{title}</td>
                            <td className="point">{attach_cnt}개</td>
                            <td className={isEndBoard ? 'right-radius' : ""}>{insert_date.substring(0, 10)}</td>
                        </tr>
                    )
                })
            }
            {!!!total_cnt && <tr><td colSpan={5}>No Data</td></tr>}
        </tbody>
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

const TABLE_TITLE = {
    width: ['90', '130', '*', '130', '130'],
    text: ['번호', '분류', '제목', '첨부파일', '등록일'],
} as const;