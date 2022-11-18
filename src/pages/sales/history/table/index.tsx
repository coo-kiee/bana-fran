import { useRef, forwardRef } from "react";
// Types
import { SalesTable } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";
// Components
import Loading from "pages/common/loading";
import Sticky from "pages/common/sticky";
import TableColGroup from "pages/sales/history/table/TableColGroup";
import TableHead from "pages/sales/history/table/TableHead";

const SalesHistoryTable = forwardRef(({ data, isLoading, rowPerPage, currentPage }: SalesTable, forwardRef: any) => {
	
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

	/* sticky 기준 ref */
	const trRef = useRef<HTMLTableRowElement>(null);
	
	return (
		<>
			<Sticky reference={trRef.current}>
				<TableColGroup />
				<TableHead />
			</Sticky>
						
			<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={forwardRef}>
				<TableColGroup />
				<TableHead ref={trRef}/>
				<tbody>
					{isLoading ? 
					<Loading width={100} height={100} marginTop={15} isTable={true} /> : 
					data.map((history: any, idx: number) => {
						const {
							rcp_date, 			// 결제일시
							cancel_date, 		// 취소일시. order_state === 50일 때만 사용
							// order_type, 		// 주문유형. 필터처리에 사용. 주문타입 1: 앱 2: 쿠팡 3: 배민 else: 매장
							order_type_name, 	// 주문유형명
							order_state, 		// 주문상태. 50일 때 취소 / 5: 대기 10|20: 제조중, 30: 제조완료, 35: 배달중, 40: 완료, 50: 취소
							order_state_name, 	// 주문상태명
							phone, 				// 전화번호
							bOrderGiftCert, 	// 실물상품권/일반제품
							item_name, 			// 주문메뉴
							nCount, 			// 총 건수
							rcp_type, 			// 접수타입
							pay_type, 			// 결제방식. 0: 결제완료, 1: 현장카드, 2: 현장현금
							nChargeTotal, 		// 주문금액(메뉴), 합계
							nDeliveryCharge, 	// 배달비(앱주문)
							card_charge, 		// 카드
							cash_charge, 		// 현금
							bana_point, 		// 바나포인트
							paid_point, 		// 충전포인트
							small_point, 		// 잔돈포인트 (?)
							fran_coupon_charge, // 가맹점쿠폰
							hd_coupon_charge, 	// 본사쿠폰
							nStampCount, 		// 스탬프(계)
							// nDeliveryPayType,// 배달비유형?
							// nOrderID,
							nSavingPoint, 		// 바나포인트(적립)
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
									<td className='align-center'>{Utils.numberComma(nChargeTotal + nDeliveryCharge)}</td>
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
					})}
				</tbody>
			</table>
		</>
	);
});

export default SalesHistoryTable;
