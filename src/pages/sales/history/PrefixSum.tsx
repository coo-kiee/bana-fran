// Types
import { PrefixSumProps } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

const PrefixSum = ({ data }: PrefixSumProps) => {
	// 기간별 상세내역 누적 합계
	const prefixSum = {
		chargeTotal: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.nChargeTotal : acc}, 0),
		deliveryCharge: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.nDeliveryCharge : acc}, 0),
		cardCharge: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.card_charge : acc}, 0),
		cashCharge: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.cash_charge : acc}, 0),
		paidPoint: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.paid_point : acc}, 0),
		banaPoint: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.bana_point : acc}, 0),
		franCoupon: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.fran_coupon_charge : acc}, 0),
		hdCoupon: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.hd_coupon_charge : acc}, 0),
		savingPoint: data.reduce((acc: any, cur: any) => {return cur.order_state !== 50 ? acc + cur.nSavingPoint : acc}, 0),
		giftCertCharge: data.reduce((acc: any, cur: any) => {return cur.bOrderGiftCert === 1 && cur.order_state !== 50 ? acc + cur.nChargeTotal : acc}, 0),
		couBaeCharge: data.reduce((acc: any, cur: any) => {return (cur.order_type === 2 || cur.order_type === 3) && cur.order_state !== 50 ? acc + cur.nChargeTotal : acc}, 0),
	};

	// 렌더용 배열
	const prefixSumArray = [
		{title: '주문금액 합계', charge: prefixSum.chargeTotal},
		{title: '배달비 합계', charge: prefixSum.deliveryCharge},
		{title: '주문금액+배달비 합계', charge: prefixSum.chargeTotal + prefixSum.deliveryCharge},
		{title: '카드결제 합계', charge: prefixSum.cardCharge},
		{title: '현금결제 합계', charge: prefixSum.cashCharge},
		{title: '유상포인트 결제 합계', charge: prefixSum.paidPoint},
		{title: '바나포인트/가맹점무료쿠폰 결제 합계', charge: prefixSum.banaPoint + prefixSum.franCoupon},
		{title: '본사 발급 쿠폰 결제 합계', charge: prefixSum.hdCoupon},
		{title: '적립 바나포인트 금액 합계', charge: prefixSum.savingPoint},
		{title: '실물 상품권 판매 금액 합계', charge: prefixSum.giftCertCharge},
		{title: '쿠팡/배민주문 금액 합계', charge: prefixSum.couBaeCharge},
	]

	return (
		<ul className='search-result'>
			{prefixSumArray.map((content: any, idx: number) => {
				const {title, charge} = content;
				return (
					<li key={idx}>
						{title}<span className='colon'></span>
						<span className='value'>{Utils.numberComma(charge || 0)}원</span>
					</li>
				)
			})}
			{/* <li>
				주문금액 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.chargeTotal || 0)}원</span>
			</li>
			<li>
				배달비 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.deliveryCharge || 0)}원</span>
			</li>
			<li>
				주문금액+배달비 합계<span className='colon'></span>
				<span className='value'>
					{Utils.numberComma(prefixSum.chargeTotal + prefixSum.deliveryCharge || 0)}원
				</span>
			</li>
			<li>
				카드결제 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.cardCharge || 0)}원</span>
			</li>
			<li>
				현금결제 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.cashCharge || 0)}원</span>
			</li>
			<li>
				유상포인트 결제 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.paidPoint || 0)}원</span>
			</li>
			<li>
				바나포인트/가맹점무료쿠폰 결제 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.banaPoint + prefixSum.franCoupon || 0)}원</span>
			</li>
			<li>
				본사 발급 쿠폰 결제 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.hdCoupon || 0)}원</span>
			</li>
			<li>
				적립 스탬프 금액 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.stampCount || 0)}원</span>
			</li>
			<li>
				적립 바나포인트 금액 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.savingPoint || 0)}원</span>
			</li>
			<li>
				실물 상품권 판매 금액 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.giftCertCharge || 0)}원</span>
			</li>
			<li>
				쿠팡/배민주문 금액 합계<span className='colon'></span>
				<span className='value'>{Utils.numberComma(prefixSum.couBaeCharge || 0)}원</span>
			</li> */}
		</ul>
	);
};

export default PrefixSum;
