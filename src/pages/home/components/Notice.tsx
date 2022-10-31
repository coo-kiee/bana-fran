import { useRecoilValue } from 'recoil';
// global state
import { franState, loginState } from 'state';

// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components//Board';
import BoardItem from 'pages/home/components/BoardItem';
// Utils
import Utils from 'utils/Utils';

interface NoticeProps {
	// fCode: number
};

const Notice = () => {
	const fCode = useRecoilValue(franState);
	const { userInfo: { staff_no } } = useRecoilValue(loginState);

	// search_type 1 - 공지 / 2 - 자료실
	const { data } = HOME_SERVICE.useBoardList({ f_code: fCode, staff_no, search_type: 1 });
	// console.log(data);
	// console.log('noticeCode: '+fCode)

	return (
		<Board title='공지사항' boardClass='notice'>
			<ul className='contents-list' style={{ minHeight: '210px' }}>
				{data?.map((board: any, idx: number) => {
					const { board_type, category_name, important, title, insert_date } = board;
					return (
						<BoardItem
							nType={board_type}
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
