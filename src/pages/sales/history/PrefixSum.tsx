// Types
import { PrefixSumProps, SalesHistoryData } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

const PrefixSum = ({ data }: PrefixSumProps<SalesHistoryData[]>) => {
	// 기간별 상세내역 누적 합계
	const prefixSum = {
		chargeTotal: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.nChargeTotal : acc}, 0),
		deliveryCharge: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.nDeliveryCharge : acc}, 0),
		cardCharge: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.card_charge : acc}, 0),
		cashCharge: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.cash_charge : acc}, 0),
		paidPoint: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.paid_point : acc}, 0),
		banaPoint: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.bana_point : acc}, 0),
		franCoupon: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.fran_coupon_charge : acc}, 0),
		hdCoupon: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.hd_coupon_charge : acc}, 0),
		savingPoint: data.reduce((acc, cur) => {return cur.order_state !== 50 ? acc + cur.nSavingPoint : acc}, 0),
		giftCertCharge: data.reduce((acc, cur) => {return cur.bOrderGiftCert === '1' && cur.order_state !== 50 ? acc + cur.nChargeTotal : acc}, 0),
		couBaeCharge: data.reduce((acc, cur) => {return (cur.order_type === 2 || cur.order_type === 3) && cur.order_state !== 50 ? acc + cur.nChargeTotal : acc}, 0),
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
			{prefixSumArray.map((content, idx) => {
				const {title, charge} = content;
				return (
					<li key={idx}>
						{title}<span className='colon'></span>
						<span className='value'>{Utils.numberComma(charge || 0)}원</span>
					</li>
				)
			})}
		</ul>
	);
};

export default PrefixSum;
