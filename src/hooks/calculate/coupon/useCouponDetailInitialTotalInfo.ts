// Hook
import useUserInfo from 'hooks/user/useUser';

// Const
import { COUPON_DETAIL_TOTAL_INFO } from 'constants/calculate/coupon';

// API
import { useCalculateCouponList } from 'service/calculateService';

const useCouponDetailInitialTotalInfo = () => {
  const { user } = useUserInfo();

  // Query
  const calculateCouponListRes = useCalculateCouponList(user.fCode, user.staffNo);

  const couponDetailTotalInfo = calculateCouponListRes?.data?.reduce((arr, cur) => {
    arr[cur.code] = { title: cur.code_name, sum: 0 };

    return arr;
  }, COUPON_DETAIL_TOTAL_INFO);

  return couponDetailTotalInfo;
};

export default useCouponDetailInitialTotalInfo;
