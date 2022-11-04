import { useRecoilValue } from 'recoil';
// import { linearGradientDef } from '@nivo/core';
import { ResponsiveBar, BarDatum, BarItemProps } from '@nivo/bar';
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

const Weekly = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'W', search_month: '2022-10-01' });
	const { hideTooltip } = useTooltip();

	return (
		<Board title='Week' boardClass='week-sales' suffix='총 매출' url=''>
			<div className='contents-list chart'>
				{
					data && 
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
				}
			</div>
			<p className='noti'>* 부가세 포함</p>
		</Board>
	);
};

export default Weekly;