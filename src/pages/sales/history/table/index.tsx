import { SalesTable } from "types/sales/salesType";
import Utils from "utils/Utils";
import LoadingTable from "../../../common/loading/LoadingTable";

const SalesHistoryTable = ({ data, isLoading, rowPerPage, currentPage }: SalesTable) => {
	
	// 표시 날짜 줄바꿈 추가
	const convertDateLineBreak = (str: string) => {
		const findSpace = /\s/;
		const strArr = str.split(findSpace);
		return (
			<>
				{strArr[0]}<br />
				{strArr[1]}
			</>
		);
	};
	
	return (
		<>
			<colgroup>
				<col width='108' />
				<col width='108' />
				<col width='50' />
				<col width='64' />
				<col width='116' />
				<col width='78' />
				<col width='94' />
				<col width='47' />
				<col width='73' />
				<col width='55' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
				<col width='62' />
			</colgroup>
			<thead>
				<tr>
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
					<th colSpan={8} className='price-area boder-th-b'>
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
					<td className='price-area'>현금</td>
					<td className='price-area'>바나포인트</td>
					<td className='price-area'>충전포인트</td>
					<td className='price-area'>잔돈포인트</td>
					<td className='price-area'>가맹점쿠폰</td>
					<td className='price-area'>본사쿠폰</td>
					<td className='price-area boder-th-l'>스탬프(개)</td>
					<td className='price-area'>바나포인트(P)</td>
				</tr>

			</thead>
			<tbody>
				{!isLoading ? data.map((history: any, idx: number) => {
					const {
						rcp_date, // 결제일시
						cancel_date, // 취소일시. order_state === 50일 때만 사용
						// order_type, // 주문유형. 필터처리에 사용. 주문타입 1: 앱 2: 쿠팡 3: 배민 else: 매장
						order_type_name, // 주문유형명
						order_state, // 주문상태. 50일 때 취소 / 5: 대기 10, 20: 제조중, 30: 제조완료, 35: 배달중, 40: 완료, 50: 취소
						order_state_name, // 주문상태명
						phone, // 전화번호
						bOrderGiftCert, // 실물상품권/일반제품
						item_name, // 주문메뉴
						nCount, // 총 건수
						rcp_type, // 접수타입
						pay_type, // 결제방식. 0: 결제완료, 1: 현장카드, 2: 현장카드?
						nChargeTotal, // 주문금액(메뉴), 합계
						nDeliveryCharge, // 배달비(앱주문)
						card_charge, // 카드
						cash_charge, // 현금
						bana_point, // 바나포인트
						paid_point, // 충전포인트
						small_point, // 잔돈포인트 (?)
						fran_coupon_charge, // 가맹점쿠폰
						hd_coupon_charge, // 본사쿠폰
						nStampCount, // 스탬프(계)
						// nDeliveryPayType, // 배달비유형?
						// nOrderID,
						nSavingPoint, // 바나포인트(적립)
						// sChargeDisDetail,
						// sChargeDisReason,
						// sCouponID,
					} = history;
					return (
						(currentPage - 1) * rowPerPage <= idx &&
						currentPage * rowPerPage > idx && (
							<tr key={idx}>
								<td className='align-center'>{convertDateLineBreak(rcp_date)}</td>
								<td className='align-center'>
									{order_state === 50 // order_state가 50(취소)일 때만 표시
										? convertDateLineBreak(cancel_date)
										: '-'}
								</td>
								<td className='align-center'>{order_type_name}</td>
								<td className='align-center'>{order_state_name}</td>
								<td className='align-center'>{phone ? phone : '-'}</td>
								<td className='align-center'>{bOrderGiftCert === 1 ? '실물상품권' : '일반제품'}</td>
								<td className='align-center'>{item_name}</td>
								<td className='align-right'>{nCount}</td>
								<td className='align-center'>{rcp_type}</td>
								<td className='align-center'>{pay_type}</td>
								<td className='align-center'>{Utils.numberComma(nChargeTotal)}</td>
								<td className='align-center'>{nDeliveryCharge !== 0 ? Utils.numberComma(nDeliveryCharge) : ''}</td>
								<td className='align-center'>{Utils.numberComma(nChargeTotal)}</td>
								<td className='align-center'>{card_charge !== 0 ? Utils.numberComma(card_charge) : ''}</td>
								<td className='align-center'>{cash_charge !== 0 ? Utils.numberComma(cash_charge) : ''}</td>
								<td className='align-center'>{bana_point !== 0 ? Utils.numberComma(bana_point) : ''}</td>
								<td className='align-center'>{paid_point !== 0 ? Utils.numberComma(paid_point) : ''}</td>
								<td className='align-center'>{small_point !== 0 ? Utils.numberComma(small_point) : ''}</td>
								<td className='align-center'>{fran_coupon_charge !== 0 ? Utils.numberComma(fran_coupon_charge) : ''}</td>
								<td className='align-center'>{hd_coupon_charge !== 0 ? Utils.numberComma(hd_coupon_charge) : ''}</td>
								<td className='align-center'>{nStampCount !== 0 ? nStampCount : ''}</td>
								<td className='align-right'>{nSavingPoint}</td>
								<td className='align-center'>-</td>
							</tr>
						))
				}) : <LoadingTable width={100} height={100} marginTop={15} />}
			</tbody>
		</>
	);
};

export default SalesHistoryTable;
