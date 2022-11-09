import { useLocation } from 'react-router-dom';
// Components
import SalesStatistic from "./statistic";
import SalesHistory from './history/index';

const SalesContainer = () => {
    const { pathname } = useLocation();
    // console.log(pathname)
    const path = pathname.replace('/sales/','');
	return (
		<section className='container'>
			<header>
				<div className='page-title sales'>
					<p className='present'>매출관리</p>
					<p className='spot'>{path === 'history' ? '주문내역' : '매출통계'}</p>
				</div>
			</header>
			<section className={`contents-wrap sales_${path === 'history' ? 'order' : 'statistic'}`}>
				<div className='contents'>
					<div className='info-wrap'>
						<p>※ {path === 'history' ? '주문내역을' : '매출통계를'} 조회할 수 있습니다. (최대 12개월 이내)</p>
					</div>
                    {
                        path === 'history' ? 
                        <SalesHistory /> :
                        <SalesStatistic />
                    }
				</div>
			</section>
		</section>
	);
};

export default SalesContainer;
