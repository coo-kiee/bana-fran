import { useRecoilValue } from 'recoil';

// global state
import { franState, loginState } from 'state';
// Components
import Notice from './components/Notice';
import Archive from './components/Archive';
import Membership from './components/Membership';
import Today from './components/Today';
import Weekly from './components/Weekly';
import Monthly from './components/Monthly';
import Ordering from './components/Ordering';
import Settlement from './components/Settlement';

const HomeContainer: React.FC = () => {
	const fCode = useRecoilValue(franState);
	const { userInfo: { f_list }, } = useRecoilValue(loginState);

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
					<p className='spot'>{f_code_name || ''}</p>
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
					<Weekly />
					<Monthly />
					<Ordering />
					<Settlement />
				</div>
			</section>
		</section>
	);
};

export default HomeContainer;
