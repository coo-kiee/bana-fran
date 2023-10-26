import { useState } from 'react';

// Const
import { CouponDetailFilterOption, COUPON_DETAIL_FILTER_OPTION } from 'constants/calculate/coupon';

// Type
import { CalculateCouponDetailListQueryResult } from 'types/calculate/calculateType';

// Hook
import useOnChange from 'hooks/useOnChange';

const useCouponFilterCondition = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(COUPON_DETAIL_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof CouponDetailFilterOption, string>,
    ),
  );
  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: CalculateCouponDetailListQueryResult) => {
      return Object.values(condition).every((item) => !item || [data.item_type_code, data.rcp_type].includes(item));
    },
  );

  return { filterCondition, handleFilterCondition, filterData };
};

export default useCouponFilterCondition;
