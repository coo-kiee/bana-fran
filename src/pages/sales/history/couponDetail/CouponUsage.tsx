import { useRecoilValue } from 'recoil';

// global state
import { franState, couponInfoState } from 'state';

// API
import SALES_SERVICE from 'service/salesService';
// Utils
import Utils from 'utils/Utils';

const CouponUsage = () => {
	const fCode = useRecoilValue(franState);
	const { nOrderID, type } = useRecoilValue(couponInfoState);
	const { data } = SALES_SERVICE.useSalesOrderCouponDetail({ f_code: fCode, order_id: nOrderID, coupon_type: type });

	return (
		<>
			{data?.map(({ sTitle, nUseCouponAmt }, idx) => (
				<tr key={`${sTitle} ${idx}`}>
					<td>{sTitle}</td>
					<td>{Utils.numberComma(nUseCouponAmt)}원</td>
				</tr>
			))}
		</>
	);
};
export default CouponUsage;
