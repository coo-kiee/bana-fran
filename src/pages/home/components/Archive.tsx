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


const Archive = () => {
	const fCode = useRecoilValue(franState);
	const { userInfo: { staff_no } } = useRecoilValue(loginState);

	// search_type 1 - 공지 / 2 - 자료실
	const { data } = HOME_SERVICE.useBoardList({ f_code: fCode, staff_no, search_type: 2 });
	// console.log(fCode);
	// console.log(data);

	return (
		<Board title='자료실' boardClass='dataroom' url='/board'>
			<ul className='contents-list' style={{ minHeight: '210px' }}>
				{data?.map((board: any, idx: number) => {
					const { board_id, board_type, important, category_name, title, insert_date } = board;
					return (
						<BoardItem
							url='/board'
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

export default Archive;
