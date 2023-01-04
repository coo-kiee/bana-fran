// Types
import { DataArrayProps, HISTORY_ORDER_STATE, HISTORY_ORDER_TYPE, HISTORY_GIFT_CERT, SalesHistoryData } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';


// filter options type
const { CANCEL } = HISTORY_ORDER_STATE;
const { COUPANG, BAEMIN } = HISTORY_ORDER_TYPE;
const { GIFT_CERT } = HISTORY_GIFT_CERT;

const PrefixSum = ({ data }: DataArrayProps<SalesHistoryData>) => {
	// 기간별 상세내역 누적 합계
	const {
		chargeTotal, deliveryCharge, cardCharge, cashCharge, paidPoint, banaPoint, franCoupon, hdCoupon, savingPoint, giftCertCharge, couBaeCharge
	} = {
		chargeTotal: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.nChargeTotal : acc}, 0),
		deliveryCharge: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.nDeliveryCharge : acc}, 0),
		cardCharge: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.card_charge : acc}, 0),
		cashCharge: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.cash_charge : acc}, 0),
		paidPoint: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.paid_point : acc}, 0),
		banaPoint: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.bana_point : acc}, 0),
		franCoupon: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.fran_coupon_charge : acc}, 0),
		hdCoupon: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.hd_coupon_charge : acc}, 0),
		savingPoint: data.reduce((acc, cur) => {return cur.order_state !== CANCEL ? acc + cur.nSavingPoint : acc}, 0),
		giftCertCharge: data.reduce((acc, cur) => {return Number(cur.bOrderGiftCert) === GIFT_CERT && cur.order_state !== CANCEL ? acc + cur.nChargeTotal : acc}, 0),
		couBaeCharge: data.reduce((acc, cur) => {return (cur.order_type === COUPANG || cur.order_type === BAEMIN) && cur.order_state !== CANCEL ? acc + cur.nChargeTotal : acc}, 0),
	};
	
	// 렌더용 배열
	const prefixSumArray = [
		{title: '주문금액 합계', charge: chargeTotal},
		{title: '배달비 합계', charge: deliveryCharge},
		{title: '주문금액+배달비 합계', charge: chargeTotal + deliveryCharge},
		{title: '카드결제 합계', charge: cardCharge},
		{title: '현금결제 합계', charge: cashCharge},
		{title: '유상포인트 결제 합계', charge: paidPoint},
		{title: '바나포인트/가맹점무료쿠폰 결제 합계', charge: banaPoint + franCoupon},
		{title: '본사 발급 쿠폰 결제 합계', charge: hdCoupon},
		{title: '적립 바나포인트 금액 합계', charge: savingPoint},
		{title: '실물 상품권 판매 금액 합계', charge: giftCertCharge},
		{title: '쿠팡/배민주문 금액 합계', charge: couBaeCharge},
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
