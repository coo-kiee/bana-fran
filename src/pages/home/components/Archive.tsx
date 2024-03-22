import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
// global state
import { franState, loginState } from 'state';

// API
import HOME_SERVICE from 'service/homeService';
// Utils
import Utils from 'utils/Utils';

// Components
import Board from 'pages/home/components/board/Board';
import BoardItem from 'pages/home/components/board/BoardItem';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import CustomLoading from './CustomLoading';

const Archive = () => {
  const fCode = useRecoilValue(franState);
  const {
    userInfo: { staff_no },
  } = useRecoilValue(loginState);
  // search_type 1 - 공지 / 2 - 자료실
  const { data } = HOME_SERVICE.useBoardList({ f_code: fCode, staff_no, search_type: 2 });

  return (
    <>
      {data?.map((board, idx) => {
        const { board_id, board_type, important, category_name, title, insert_date } = board;
        return (
          <BoardItem
            url="/board"
            boardType={board_type}
            boardId={board_id}
            important={important}
            name={category_name}
            title={title}
            date={Utils.converDateFormat(insert_date, '-')}
            key={title + idx}
          />
        );
      })}
    </>
  );
};

const ArchiveContainer = () => {
  return (
    <Board title="자료실" boardClass="dataroom" url="/board">
      <ul className="contents-list">
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />}
          onError={(e) => console.log('error on Archive(자료실): ', e)}
        >
          <Suspense fallback={<CustomLoading padding="62px 0" />}>
            <Archive />
          </Suspense>
        </ErrorBoundary>
      </ul>
    </Board>
  );
};

export default ArchiveContainer;
