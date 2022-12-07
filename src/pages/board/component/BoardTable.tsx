import React, { FC, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

// API
import BOARD_SERVICE from "service/boardService";

// Type
import { MenuType } from "types/board/boardType";
import { ListSearchParameter } from "..";

// Component
import Pagination from "pages/common/pagination";
import NoData from "pages/common/noData";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

interface BoardTableProps {
    menuType: MenuType,
    listSearchParameter: ListSearchParameter,
    setListSearchParameter: React.Dispatch<React.SetStateAction<ListSearchParameter>>,
};
const BoardTable: FC<BoardTableProps> = ({ menuType, listSearchParameter, setListSearchParameter }) => {

    const [dataCnt, setDataCnt] = useState(0);
    
    const { width, headerText } = TABLE_COLUMN_INFO;
    
    return (
        <>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('listError', e)}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                            <TableList menuType={menuType} listSearchParameter={listSearchParameter} setDataCnt={setDataCnt} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            <TableBottom dataCnt={dataCnt} row={listSearchParameter.page_size || 50} currentPage={listSearchParameter.page_idx || 1} setListSearchParameter={setListSearchParameter} />
        </>
    );
}

export default BoardTable;



interface TableListProps {
    menuType: MenuType,
    listSearchParameter: ListSearchParameter,
    setDataCnt: React.Dispatch<React.SetStateAction<number>>,
    // boardList: BoardListResult,
    // boardType: number,
};
const TableList: FC<TableListProps> = ({ menuType, listSearchParameter, setDataCnt }) => {

    const { search_category, search_text, board_type } = listSearchParameter;
    const params = { ...listSearchParameter, search_category: search_category[board_type], search_text: search_text[board_type] };

    const { data: boardList } = BOARD_SERVICE.useBoardList(params);
    const { list, out: pageInfo } = boardList || {};
    const totalCnt = pageInfo?.total_cnt || 0;

    // 게시글 상세보기로 이동
    const navigation = useNavigate();
    const moveToDetail = (boardId: number) => {
        navigation(`/${menuType}/${board_type}/${boardId}`);
    };

    // 리스트 패치 후 totalCnt 갱신
    useEffect(() => {
        if (pageInfo) setDataCnt(prev => pageInfo.total_cnt);
    }, [setDataCnt, pageInfo])

    return (
        <>
            {
                list?.map((board, index) => {

                    const { category_name, title, attach_cnt, insert_date, rownum, important, board_id } = board;
                    const rowNumInt = totalCnt - Number(rownum) + 1;
                    const isEndBoard = index === (totalCnt - 1);
                    const isImportant = important === "1";

                    return (
                        <tr className={isImportant ? "important" : ""} key={rowNumInt} >
                            <td className={isImportant ? "point" : isEndBoard ? 'left-radius' : ""}>{isImportant ? "중요" : rowNumInt}</td>
                            <td>{category_name}</td>
                            <td className="content" onClick={() => moveToDetail(board_id)} >{title}</td>
                            <td className={isImportant ? "point" : ""}>{attach_cnt}개</td>
                            <td className={isEndBoard ? 'right-radius' : ""}>{insert_date.substring(0, 10)}</td>
                        </tr>
                    )
                })
            }
            {!!!totalCnt && <NoData isTable={true} />}
        </>
    )
};

interface TableBottomProps {
    dataCnt: number,
    currentPage: number,
    row: number,
    setListSearchParameter: React.Dispatch<React.SetStateAction<ListSearchParameter>>,
};
const TableBottom: FC<TableBottomProps> = ({ dataCnt, currentPage, row, setListSearchParameter }) => {

    const handlePageChange = (changePage: number) => {
        setListSearchParameter(prev => ({ ...prev, page_idx: changePage }));
    };

    const handlePageRow = (row: number) => {
        setListSearchParameter(prev => ({ ...prev, page_size: row }));
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
};

// Component Type
const TABLE_COLUMN_INFO = {
    width: ['90', '130', '*', '130', '130'],
    headerText: ['번호', '분류', '제목', '첨부파일', '등록일'],
} as const;