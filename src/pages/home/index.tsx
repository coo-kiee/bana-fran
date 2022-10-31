import { useRecoilValue } from 'recoil';

import Archive from './components/Archive';
import Notice from './components/Notice';
import Membership from './components/Membership';
import Today from './components/Today';
import WeeklyChart from './components/Weekly';
import Monthly from './components/Monthly';
import { franState, loginState } from 'state';
import Ordering from './components/Ordering';
import Settlement from './components/Settlement';

const HomeContainer: React.FC = () => {
	const fCode = useRecoilValue(franState);
	const {
		userInfo: { f_list },
	} = useRecoilValue(loginState);

	// 선택된 가맹점 정보
	const fSelected = f_list?.filter((fran: any) => {
		return fran.f_code === fCode;
	})[0];
	// 가맹점명
	const { f_code_name } = fSelected;

	return (
		<section className='container'>
			<header>
				<div className='page-title home'>
					<p className='present'>HOME</p>
					<p className='spot'>{f_code_name}</p>
				</div>
			</header>
			<section className='dashboard'>
				{/* <!-- 공지사항, 자료실, 멤버십 적립현황 --> */}
				<div className='board-wrap border-top'>
					<Notice />
					<Archive />
					<Membership />
				</div>
				{/* <!-- // 공지사항, 자료실, 멤버십 적립현황 --> */}

				<div className='board-wrap'>
					<Today />
				</div>
				{/* <!-- Week, Month, 월별 발주 금액, 최근 정산 현황--> */}
				<div className='board-wrap'>
					<WeeklyChart />
					<Monthly />
					<Ordering />
					<Settlement />
				</div>
				{/* <!-- // Week, Month, 월별 발주 금액, 최근 정산 현황--> */}
			</section>
		</section>
	);
};

export default HomeContainer;
