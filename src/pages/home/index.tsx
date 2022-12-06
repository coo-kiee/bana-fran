import { lazy } from 'react';
import { useRecoilValue } from 'recoil';

// global state
import { franState, loginState } from 'state';

// lazy components
const Notice = lazy(() => import('./components/Notice'));
const Archive = lazy(() => import('./components/Archive'));
const Membership = lazy(() => import('./components/Membership'));
const TodaySales = lazy(() => import('./components/Today'));
const WeeklySales = lazy(() => import('./components/WeeklySales'));
const MonthlySales = lazy(() => import('./components/MonthlySales'));
const MonthlyOrder = lazy(() => import('./components/MonthlyOrder'));
const CalculateList = lazy(() => import('./components/CalculateList'));

const HomeContainer: React.FC = () => {
	const fCode = useRecoilValue(franState);
	const { userInfo: { f_list }, } = useRecoilValue(loginState);

	// 선택된 가맹점 정보
	const fSelected = f_list?.filter((fran: any) => {
		return fran.f_code === fCode;
	})[0];

	return (
		<section className='container' style={{ minWidth: '1820px' }}>
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
					<TodaySales />
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
