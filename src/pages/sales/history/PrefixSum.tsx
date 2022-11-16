import { useMemo } from 'react';
// Types
import { PrefixSumProps } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

const PrefixSum = ({ data }: PrefixSumProps) => {
	// 기간별 상세내역 누적 합계
	const prefixSum = useMemo(() => {
		return {
			chargeTotal: data.reduce((acc: any, cur: any) => {
				return acc + cur.nChargeTotal;
			}, 0),
			deliveryCharge: data.reduce((acc: any, cur: any) => {
				return acc + cur.nDeliveryCharge;
			}, 0),
			cardCharge: data.reduce((acc: any, cur: any) => {
				return acc + cur.card_charge;
			}, 0),
			cashCharge: data.reduce((acc: any, cur: any) => {
				return acc + cur.cash_charge;
			}, 0),
			paidPoint: data.reduce((acc: any, cur: any) => {
				return acc + cur.paid_point;
			}, 0),
			banaPoint: data.reduce((acc: any, cur: any) => {
				return acc + cur.bana_point;
			}, 0),
			franCoupon: data.reduce((acc: any, cur: any) => {
				return acc + cur.fran_coupon_charge;
			}, 0),
			hdCoupon: data.reduce((acc: any, cur: any) => {
				return acc + cur.hd_coupon_charge;
			}, 0),
			stampCount: data.reduce((acc: any, cur: any) => {
				return acc + cur.nStampCount;
			}, 0),
			savingPoint: data.reduce((acc: any, cur: any) => {
				return acc + cur.nSavingPoint;
			}, 0),
			giftCertCharge: data.reduce((acc: any, cur: any) => {
				return cur.bOrderGiftCert === 1 ? acc + 1 : acc;
			}, 0),
			couBaeCharge: data.reduce((acc: any, cur: any) => {
				return cur.order_type === 2 || cur.order_type === 3 ? acc + cur.nChargeTotal : acc;
			}, 0),
		};
	}, [data]);

	return (
		<ul className='search-result'>
			<li>
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
			</li>
		</ul>
	);
};

export default PrefixSum;
