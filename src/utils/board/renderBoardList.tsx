import { NavigateFunction } from 'react-router-dom';

// Type
import { BoardListQueryResult } from 'types/board/boardType';

export const renderBoardList = (boardData: BoardListQueryResult, baseUrl: string, navigate: NavigateFunction) => {
  return boardData.list.map((item, index, arr) => {
    const isImportant = item.important === '1';
    const isLastItem = arr.length - 1 === index;

    return (
      <tr className={isImportant ? 'important' : ''} key={index}>
        <td className={isImportant ? 'point' : isLastItem ? 'left-radius' : ''}>
          {isImportant ? '중요' : boardData.out.total_cnt - Number(item.rownum) + 1}
        </td>
        <td>{item.category_name}</td>
        <td className="content" onClick={() => navigate(`${baseUrl}/${item.board_id}`)}>
          {item.title}
        </td>
        <td className={isImportant ? 'point' : ''}>{item.attach_cnt}개</td>
        <td className={isLastItem ? 'right-radius' : ''}>{item.insert_date.substring(0, 10)}</td>
      </tr>
    );
  });
};
