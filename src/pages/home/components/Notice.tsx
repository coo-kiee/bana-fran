import { lazy, Suspense } from 'react';
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
// import BoardItem from 'pages/home/components/board/BoardItem';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import loadable from '@loadable/component';
const BoardItem = lazy(() => import ('pages/home/components/board/BoardItem'));

const Notice = () => {
	const fCode = useRecoilValue(franState);
	const { userInfo: { staff_no } } = useRecoilValue(loginState);

	// search_type 1 - 공지 / 2 - 자료실
	const { data } = HOME_SERVICE.useBoardList({ f_code: fCode, staff_no, search_type: 1 });

	return (
		<Board title='공지사항' boardClass='notice' url='/notice'>
			<ul className='contents-list' style={{ minHeight: '210px' }}>
						{data?.map((board: any, idx: number) => {
							const { board_id, board_type, category_name, important, title, insert_date } = board;
							return (
								<BoardItem
									url='/notice'
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
			</ul>
		</Board>
	);
};

export default Notice;
