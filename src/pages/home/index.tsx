import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

// global state
import { franState, loginState } from 'state';
// Components
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
// lazy components
const Notice = lazy(() => import('./components/Notice'));
const Archive = lazy(() => import('./components/Archive'));
const Membership = lazy(() => import('./components/Membership'));
const Today = lazy(() => import('./components/Today'));
const Weekly = lazy(() => import('./components/Weekly'));
const Monthly = lazy(() => import('./components/Monthly'));
const MonthlyOrder = lazy(() => import('./components/MonthlyOrder'));
const CalculateList = lazy(() => import('./components/CalculateList'));

const HomeContainer: React.FC = () => {
	const fCode = useRecoilValue(franState);
	const { userInfo: { f_list }, } = useRecoilValue(loginState);

	// 선택된 가맹점 정보
	const fSelected = f_list?.filter((fran: any) => {
		return fran.f_code === fCode;
	})[0];
	// 브라우저 높이
	const windowHeight = window?.innerHeight;

	return (
		<section className='container'>
			<header>
				<div className='page-title home'>
					<p className='present'>HOME</p>
					<p className='spot'>{fSelected?.f_code_name || ''}</p>
				</div>
			</header>
			<section className='dashboard'>
				<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('detailError', e)}>
					<Suspense fallback={<Loading marginTop={(windowHeight)/2 - 179} />}>
						<div className='board-wrap border-top'>
							<Notice />
							<Archive />
							<Membership />
						</div>
						<div className='board-wrap'>
							<Today />
						</div>
						<div className='board-wrap'>
							<Weekly />
							<Monthly />
							<MonthlyOrder />
							<CalculateList />
						</div>
					</Suspense>
				</ErrorBoundary>
			</section>
		</section>
	);
};

export default HomeContainer;
