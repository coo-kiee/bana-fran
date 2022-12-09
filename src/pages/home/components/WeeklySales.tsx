import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
import { ResponsiveBar } from '@nivo/bar';
import { useTooltip } from '@nivo/tooltip';

// global state
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/board/Board';
import ChartLabel from 'pages/home/components/chart/ChartLabel';
import ChartBar from 'pages/home/components/chart/ChartBar';
import ChartDays from 'pages/home/components/chart/ChartDays';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

const WeeklySales = () => {
	const fCode = useRecoilValue(franState);
	const { hideTooltip } = useTooltip();
	const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'W' });
	
	return (
		<ResponsiveBar
			data={data}
			keys={['sales_charge']}
			indexBy='std_date'
			margin={{ top: 70, right: 0, bottom: 50, left: 0 }}
			padding={0.84}
			groupMode='grouped'
			valueScale={{ type: 'linear' }}
			indexScale={{ type: 'band', round: true }}
			colors={{ scheme: 'nivo' }}
			animate={true}
			enableGridY={false}
			axisTop={null}
			axisRight={null}
			axisBottom={null}
			axisLeft={null}
			theme={{
				axis: {
					ticks: {
						text: { // axis label font properties
							fontSize: 12,
							fontWeight: 'bold',
						}
					}
				}
			}}
			enableLabel={false}
			role='application'
			ariaLabel='Weekly Sales'
			layers={[
				'grid',
				'axes',
				(props) => <ChartLabel {...props} />,
				(props) => <ChartBar {...props} onMouseLeave={hideTooltip} />,
				'markers',
				'legends',
				(props) => <ChartDays {...props} />
			]}
		/>		
	);
};

const WeeklyContainer = () => {
	return (
		<Board title='Week' boardClass='week-sales' url='/sales/history' suffix='총 매출'>
			<div className='contents-list bar-chart chart'>
				<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <div style={{marginTop:'90px'}}><SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} /></div>} onError={(e) => console.log('error on WeeklySales(Week 총 매출): ', e)}>
                    <Suspense fallback={<Loading width={50} height={50} marginTop={153.5} />}>
						<WeeklySales />
					</Suspense>
				</ErrorBoundary>
			</div>
			<p className='noti'>* 부가세 포함</p>
		</Board>
	);
}
export default WeeklyContainer;