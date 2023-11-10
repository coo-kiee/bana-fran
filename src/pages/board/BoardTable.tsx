import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Const
import { BoardTab, BOARD_COLGROUP_INFO, BOARD_THEAD_INFO } from 'constants/board';
import { PAGE_URL } from 'pages/common/sideMenubar/data/SideMenu';

// Hook
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// API
import { useBoardList } from 'service/boardService';

// Util
import { renderBoardList } from 'utils/board/renderBoardList';

// Component
import Pages from 'pages/common/pagination/Pages';
import Table from 'pages/common/table';

interface IBoardTable {
  tabType: BoardTab;
  category: number;
  searchText: string;
}
const BoardTable = ({ tabType, category, searchText }: IBoardTable) => {
  const navigate = useNavigate();

  const { user } = useUserInfo();
  const { pageInfo, handleDataCnt, handleCurrentPage } = usePageInfo();

  // Query
  const boardListRes = useBoardList({
    f_code: user.fCode,
    staff_no: user.staffNo,
    board_type: tabType,
    search_category: category,
    search_text: searchText,
    page_idx: pageInfo.currentPage,
    page_size: pageInfo.row,
  });

  useEffect(() => {
    if (!boardListRes.data?.out) return;

    handleDataCnt(boardListRes.data.out.total_cnt);
    handleCurrentPage(boardListRes.data.out.active_page_idx);
  }, [boardListRes.data?.out, handleDataCnt, handleCurrentPage]);

  return (
    <>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={BOARD_COLGROUP_INFO} />
        <Table.TableHead thData={BOARD_THEAD_INFO} />
        <Table.TableList
          queryRes={boardListRes}
          render={(data) => renderBoardList(data, `${PAGE_URL.NOTICE}/${tabType}`, navigate)}
        />
      </Table>
      <div className="result-function-wrap">
        <Pages />
      </div>
    </>
  );
};

export default BoardTable;
