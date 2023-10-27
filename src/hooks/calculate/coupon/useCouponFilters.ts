// Const
import { COUPON_DETAIL_FILTER_OPTION, COUPON_DETAIL_FILTER_TYPE } from 'constants/calculate/coupon';

// Hook
import useUserInfo from 'hooks/user/useUser';

// Util
import { deepClone } from 'utils/deepClone';

// API
import { useCalculateCouponList } from 'service/calculateService';

const useCouponFilters = () => {
  const { user } = useUserInfo();

  // Query
  const calculateCouponListRes = useCalculateCouponList(user.fCode, user.staffNo);

  const couponFilters = calculateCouponListRes.data?.reduce((arr, cur) => {
    arr.push({ label: cur.code_name, value: cur.code });

    return arr;
  }, deepClone(COUPON_DETAIL_FILTER_OPTION[COUPON_DETAIL_FILTER_TYPE.COUPON]));

  return couponFilters || COUPON_DETAIL_FILTER_OPTION[COUPON_DETAIL_FILTER_TYPE.COUPON];
};

export default useCouponFilters;
