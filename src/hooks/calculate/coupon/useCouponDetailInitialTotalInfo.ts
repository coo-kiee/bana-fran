import { useLayoutEffect, useState } from 'react';

// Hook
import useUserInfo from 'hooks/user/useUser';

// Const
import { COUPON_DETAIL_TOTAL_INFO } from 'constants/calculate/coupon';

// API
import { useCalculateCouponList } from 'service/calculateService';

const useCouponDetailInitialTotalInfo = () => {
  const { user } = useUserInfo();
  const [couponDetailInitialTotalInfo, setCouponDetailInitialTotalInfo] = useState(COUPON_DETAIL_TOTAL_INFO);

  // Query
  const calculateCouponListRes = useCalculateCouponList(user.fCode, user.staffNo);

  useLayoutEffect(() => {
    if (!calculateCouponListRes?.data) return;

    const updateCouponDetailTotalInfo = calculateCouponListRes.data.reduce(
      (arr, cur) => {
        arr[cur.code] = { title: cur.code_name, sum: 0 };
        return arr;
      },
      {} as typeof couponDetailInitialTotalInfo,
    );

    setCouponDetailInitialTotalInfo({ ...updateCouponDetailTotalInfo, ...COUPON_DETAIL_TOTAL_INFO });
  }, [calculateCouponListRes?.data]);

  return { couponDetailInitialTotalInfo };
};

export default useCouponDetailInitialTotalInfo;
