import { useNavigate } from "react-router-dom";
// Types
import { BoardItemProps } from "types/home/homeType";

const BoardItem = ({ url, boardType, boardId, important, name, title, date }: BoardItemProps) => {
	const navigate = useNavigate();
	let typeText = 'general';

	// 게시판 정보. (board_type : -- 1 : 공지사항, 2 : 운영 매뉴얼, 3 : 교육자료실, 4 : 레시피자료실, 5 : 규정 및 가이드, 6 : 정산관련 공지 )
	// board_type 1 / 6 이면 공지. 공지는 이름으로 매핑 자료실은 board_type으로 매핑
	if (important === '1') {
		// 중요가 1이면 important처리
		typeText = 'important';
	} else if (boardType === 1) {
		// boardType이 1 || 6이면 공지사항
		switch (name) {
			case '일반': typeText = 'general'; break;
			default: typeText = 'guide'; break;
		}
	} else if (boardType === 6) {
		typeText = 'calculate'; // 정산공지
	} else {
		switch (boardType) {
			// case 1: typeText = 'general'; break;    	// 일반 공지
			case 2: typeText = 'menual'; break;			// 운영 메뉴얼
			case 3: typeText = 'education';	break; 		// 교육
			case 4:	typeText = 'recipe'; break; 		// 레시피
			case 5: typeText = 'guide'; break; 			// 규정 가이드
			// case 6: typeText = 'calculate'; break;   // 정산
			default: typeText = 'default'; break;
		}
	}

	return (
		<li className='list-item'>
			<p className={`state ${typeText}`}>{name}</p>
			<p className='contents ellipsis' onClick={() => navigate(`${url}/${boardType}/${boardId}`)}>{title}</p>
			<p className='date'>{date}</p>
		</li>
	);
};

export default BoardItem;
