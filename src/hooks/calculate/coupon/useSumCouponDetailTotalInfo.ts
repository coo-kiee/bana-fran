import { useLayoutEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

// Type
import { CouponDetailTotalInfo, COUPON_SUM_TYPE } from 'constants/calculate/coupon';
import { CalculateCouponDetailListQueryResult } from 'types/calculate/calculateType';

// API
import { CALCULATE_QUERY_KEY } from 'service/calculateService';

// Util
import { deepClone } from 'utils/deepClone';

// Hook
import useUserInfo from 'hooks/user/useUser';

const useSumCouponDetailTotalInfo = (initialDetailTotalInfo: CouponDetailTotalInfo) => {
  const { user } = useUserInfo();
  const [totalInfo, setTotalInfo] = useState(initialDetailTotalInfo);

  // Query
  const queryClient = useQueryClient();
  const couponDetailListData = queryClient
    .getQueryCache()
    .getAll()
    .filter((query) =>
      [CALCULATE_QUERY_KEY.CALCULATE_COUPON_DETAIL_LIST, user.fCode].every((checkKey) =>
        query.queryKey.includes(checkKey as string),
      ),
    )[0]?.state.data as CalculateCouponDetailListQueryResult[];

  useLayoutEffect(() => {
    if (!couponDetailListData?.length) return;

    const initialSumObj: CouponDetailTotalInfo = deepClone(initialDetailTotalInfo);

    const sumObj = couponDetailListData.reduce((arr, cur) => {
      arr[cur.item_type_code].sum += cur.total_amt;

      const 미보전코드 = [99];
      if (!미보전코드.includes(cur.item_type_code)) arr[COUPON_SUM_TYPE.ALL].sum += cur.total_amt;

      return arr;
    }, initialSumObj);

    setTotalInfo(sumObj);
  }, [couponDetailListData, initialDetailTotalInfo, queryClient]);

  return totalInfo;
};

export default useSumCouponDetailTotalInfo;
