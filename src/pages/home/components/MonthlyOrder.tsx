import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

// global state
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Utils
import Utils from 'utils/Utils';
// Components
import Board from 'pages/home/components/board/Board';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';


const MonthlyOrder = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useMonthlyOrderList({ f_code: fCode });

	return (
		<>
			{data?.map((order, idx, origData) => {
				const {deposit, log_date} = order;
				return (
					<tr key={log_date + idx}>
						<td className={idx === (origData.length - 1) ? 'last' : ''}>{log_date}</td>
						<td className={idx === (origData.length - 1) ? 'last' : ''}>{Utils.numberComma(deposit)}</td>
					</tr>
				);
			})}
		</>
	);
};

const MonthlyOrderContainer = () => {
	return (
		<Board boardClass='ordering' title='월별 발주 금액' url='/sales/statistic' showLink={true}>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='104' />
					<col width='151' />
				</colgroup>
				<thead>
					<tr>
						<th>월</th>
						<th>발주금액</th>
					</tr>
				</thead>
				<tbody>
					<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage isTable={true} paddingTop='0px' resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('error on MonthlyOrder(월별 발주 금액): ', e)}>
						<Suspense fallback={<Loading width={50} height={50} marginTop={15} isTable={true} />}>	
							<MonthlyOrder />
						</Suspense>
					</ErrorBoundary>
				</tbody>
			</table>		
		</Board>
	);
}

export default MonthlyOrderContainer;
