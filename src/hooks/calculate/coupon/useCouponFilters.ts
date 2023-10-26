import { useLayoutEffect, useState } from 'react';

// Const
import { COUPON_DETAIL_FILTER_OPTION, COUPON_DETAIL_FILTER_TYPE } from 'constants/calculate/coupon';

// Hook
import useUserInfo from 'hooks/user/useUser';

// API
import { useCalculateCouponList } from 'service/calculateService';

const useCouponFilters = () => {
  const { user } = useUserInfo();

  const [couponFilters, setCouponFilters] = useState(COUPON_DETAIL_FILTER_OPTION[COUPON_DETAIL_FILTER_TYPE.COUPON]);

  // Query
  const calculateCouponListRes = useCalculateCouponList(user.fCode, user.staffNo);

  useLayoutEffect(() => {
    if (!calculateCouponListRes?.data) return;

    const updateCouponFilters = calculateCouponListRes.data.reduce(
      (arr, cur) => {
        arr.push({ label: cur.code_name, value: cur.code });
        return arr;
      },
      [] as typeof couponFilters,
    );

    setCouponFilters([...COUPON_DETAIL_FILTER_OPTION[COUPON_DETAIL_FILTER_TYPE.COUPON], ...updateCouponFilters]);
  }, [calculateCouponListRes?.data]);

  return { couponFilters };
};

export default useCouponFilters;
