import { forwardRef } from 'react';

const TableHead = forwardRef((_, forwardRef: React.LegacyRef<HTMLTableRowElement>) => {
	return (
		<thead>
			<tr ref={forwardRef}>
				<th rowSpan={2}>
					결제<span className='block'>일시</span>
				</th>
				<th rowSpan={2}>
					취소<span className='block'>일시</span>
				</th>
				<th rowSpan={2}>
					주문<span className='block'>유형</span>
				</th>
				<th rowSpan={2}>
					주문<span className='block'>상태</span>
				</th>
				<th rowSpan={2}>
					전화<span className='block'>번호</span>
				</th>
				<th rowSpan={2}>
					판매<span className='block'>구분</span>
				</th>
				<th rowSpan={2}>
					주문<span className='block'>메뉴</span>
				</th>
				<th rowSpan={2}>
					총<br />건수
				</th>
				<th rowSpan={2}>
					접수<span className='block'>타입</span>
				</th>
				<th rowSpan={2}>
					결제<span className='block'>방식</span>
				</th>
				<th rowSpan={2}>
					주문금액<br />(메뉴)
				</th>
				<th rowSpan={2}>
					배달비<br />(앱주문)
				</th>
				<th colSpan={13} className='price-area boder-th-b'>
					결제상세(앱주문 배달비 포함)
				</th>
				<th colSpan={2} className='price-area boder-th-b boder-th-l'>
					적립
				</th>
				<th rowSpan={2}>현금영수증</th>
			</tr>
			<tr>
				<td className='price-area boder-th-b'>합계</td>
				<td className='price-area'>카드</td>
				<td className='price-area'>간편결제</td>
				<td className='price-area'>현금</td>
				<td className='price-area'>바나포인트</td>
				<td className='price-area'>충전포인트</td>
				<td className='price-area'>보너스<br />충전포인트</td>
				<td className='price-area'>잔돈포인트</td>
				<td className='price-area'>가맹점쿠폰</td>
				<td className='price-area'>본사쿠폰<br />(보전)</td>
				<td className='price-area'>본사쿠폰<br />(미보전)</td>
				<td className='price-area'>쿠팡/배민<br />(주문금액)</td>
				<td className='price-area'>쿠팡/배민<br />(배달비)</td>
				<td className='price-area boder-th-l'>스탬프(개)</td>
				<td className='price-area'>바나포인트(P)</td>
			</tr>
		</thead>
	);
});

export default TableHead;
