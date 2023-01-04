import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

// global state
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Types
import { CALCULATE_STATUS } from 'types/home/homeType';
// Utils
import Utils from 'utils/Utils';
// Components
import Board from 'pages/home/components/board/Board';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// 정산 상태 type
const { UNCONFIRMED } = CALCULATE_STATUS;

const CalculateList = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useHomeCalculateList({ f_code: fCode });

	return (
		<>
			{data?.map((settlement, idx) => {
				const { std_month, receive_charge, send_charge, total_send_charge, status, status_name } = settlement;
				return (
					<tr key={String(std_month) + idx}>
						<td className={status === UNCONFIRMED ? 'point' : ''}>{std_month}</td>
						<td className={status === UNCONFIRMED ? 'point' : ''}>{Utils.numberComma(send_charge)}</td>
						<td className={status === UNCONFIRMED ? 'point' : ''}>{Utils.numberComma(receive_charge)}</td>
						<td className={status === UNCONFIRMED ? 'point point-text' : ''}>{Utils.numberComma(total_send_charge)}</td>
						<td className={status === UNCONFIRMED ? 'point' : ''}>{status_name}</td>
					</tr>
				);
			})}
		</>
	);
};

const CalculateListContainer = () => {
	return (
		<Board boardClass='status' title='최근 정산 현황' url='/calculate/list'>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='105' />
					<col width='105' />
					<col width='105' />
					<col width='105' />
					<col width='105' />
				</colgroup>
				<thead>
					<tr>
						<th>정산월</th>
						<th>보전금액</th>
						<th>청구금액</th>
						<th>합계</th>
						<th>상태</th>
					</tr>
				</thead>
				<tbody>
					<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage isTable={true} paddingTop='0px' resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('error on CalculateList(최근 정산 현황): ', e)}>
						<Suspense fallback={<Loading width={50} height={50} marginTop={15} isTable={true} />}>	
							<CalculateList />
						</Suspense>
					</ErrorBoundary>
				</tbody>
			</table>
		</Board>
	)
}
export default CalculateListContainer;