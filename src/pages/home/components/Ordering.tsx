import Board from 'pages/home/components/board/Board';

type Props = {};

const Ordering = (props: Props) => {
	return (
		<Board boardClass='ordering' title='월별 발주 금액' url=''>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='104' />
					<col width='151' />
				</colgroup>
				<tbody>
					<tr>
						<th>월</th>
						<th>발주금액</th>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>1,000,000</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>1,000,000</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>1,000,000</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>1,000,000</td>
					</tr>
					<tr>
						<td>2022-10</td>
						<td>1,000,000</td>
					</tr>
					<tr>
						<td className='last'>2022-10</td>
						<td className='last'>1,000,000</td>
					</tr>
				</tbody>
			</table>
		</Board>
	);
};

export default Ordering;
