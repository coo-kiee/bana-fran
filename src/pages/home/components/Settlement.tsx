import Board from 'pages/home/components/board/Board';

const Settlement = () => {
	return (
		<Board boardClass='status' title='최근 정산 현황' url=''>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='105' />
					<col width='105' />
					<col width='105' />
					<col width='105' />
					<col width='105' />
				</colgroup>
				<tbody>
					<tr>
						<th>정산월</th>
						<th>보전금액</th>
						<th>청구금액</th>
						<th>합계</th>
						<th>상태</th>
					</tr>
					<tr>
						<td className='point'>2022-10</td>
						<td className='point'>10,000</td>
						<td className='point'>20,000</td>
						<td className='point point-text'>-10,000</td>
						<td className='point'>미확인</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>10,000</td>
						<td>20,000</td>
						<td>-10,000</td>
						<td>미확인</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>10,000</td>
						<td>20,000</td>
						<td>-10,000</td>
						<td>미확인</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>10,000</td>
						<td>20,000</td>
						<td>-10,000</td>
						<td>미확인</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>10,000</td>
						<td>20,000</td>
						<td>-10,000</td>
						<td>미확인</td>
					</tr>
					<tr>
						<td className='last'>2022-10</td>
						<td className='last'>10,000</td>
						<td className='last'>20,000</td>
						<td className='last'>-10,000</td>
						<td className='last'>미확인</td>
					</tr>
				</tbody>
			</table>
		</Board>
	);
};

export default Settlement;
