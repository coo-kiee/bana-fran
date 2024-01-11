import { useState } from 'react';

// Const
import { StampCouponDetailFilterOption, STAMP_COUPON_DETAIL_FILTER_OPTION } from 'constants/calculate/stampCoupon';

// Type
import { CalculateStampCouponDetailListQueryResult } from 'types/calculate/calculateType';

// Hook
import useOnChange from 'hooks/useOnChange';

const useStampCouponFilterCondition = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(STAMP_COUPON_DETAIL_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof StampCouponDetailFilterOption, string>,
    ),
  );
  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: CalculateStampCouponDetailListQueryResult) => {
      return Object.values(condition).every((item) => !item || [data.calc_type].includes(item));
    },
  );

  return { filterCondition, handleFilterCondition, filterData };
};

export default useStampCouponFilterCondition;
