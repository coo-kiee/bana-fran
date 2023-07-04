import { useRecoilValue } from 'recoil';

// global state
import { franState, loginState } from 'state';

// Components
import Archive from 'pages/home/components/Archive';
import CalculateList from 'pages/home/components/CalculateList';
import Membership from 'pages/home/components/Membership';
import MonthlyOrder from 'pages/home/components/MonthlyOrder';
import MonthlySales from 'pages/home/components/MonthlySales';
import Notice from 'pages/home/components/Notice';
import Today from 'pages/home/components/Today';
import WeeklySales from 'pages/home/components/WeeklySales';

const HomeContainer: React.FC = () => {
	const fCode = useRecoilValue(franState);
	const {userInfo: { f_list }} = useRecoilValue(loginState);
	// 선택된 가맹점 정보
	const fSelected = f_list?.filter((fran) => {
		return fran.f_code === fCode;
	})[0];

	return (
		<section className='container min-width-1800'>
			<header>
				<div className='page-title home'>
					<p className='present'>HOME</p>
					<p className='spot'>{fSelected?.f_code_name || ''}</p>
				</div>
			</header>
			<section className='dashboard'>
				<div className='board-wrap border-top'>
					<Notice />
					<Archive />
					<Membership />
				</div>
				<div className='board-wrap'>
					<Today />
				</div>
				<div className='board-wrap'>
					<WeeklySales />
					<MonthlySales />
					<MonthlyOrder />
					<CalculateList />
				</div>
			</section>
		</section>
	);
};

export default HomeContainer;
