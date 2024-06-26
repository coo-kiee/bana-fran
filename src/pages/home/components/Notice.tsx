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

const Notice = () => {
  const fCode = useRecoilValue(franState);
  const {
    userInfo: { staff_no },
  } = useRecoilValue(loginState);

  // search_type 1 - 공지 / 2 - 자료실
  const { data } = HOME_SERVICE.useBoardList({ f_code: fCode, staff_no, search_type: 1 });

  return (
    <>
      {data?.map((board, idx) => {
        const { board_id, board_type, category_name, important, title, insert_date } = board;
        return (
          <BoardItem
            url="/notice"
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

const NoticeContainer = () => {
  return (
    <Board title="공지사항" boardClass="notice" url="/notice">
      <ul className="contents-list">
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />}
          onError={(e) => console.log('error on Notice(공지사항): ', e)}
        >
          <Suspense fallback={<CustomLoading padding="62px 0" />}>
            <Notice />
          </Suspense>
        </ErrorBoundary>
      </ul>
    </Board>
  );
};
export default NoticeContainer;
