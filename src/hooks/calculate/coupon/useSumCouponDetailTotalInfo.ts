import { useLayoutEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

// Type
import { CouponDetailTotalInfo, COUPON_DETAIL_TOTAL_INFO, COUPON_SUM_TYPE } from 'constants/calculate/coupon';
import { CalculateCouponDetailListQueryResult } from 'types/calculate/calculateType';

// API
import { CALCULATE_QUERY_KEY, IUseCalculateCouponDetailList } from 'service/calculateService';

// Util
import { deepClone } from 'utils/deepClone';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useCouponDetailInitialTotalInfo from './useCouponDetailInitialTotalInfo';

const useSumCouponDetailTotalInfo = (params: IUseCalculateCouponDetailList['params']) => {
  const { user } = useUserInfo();
  const [totalInfo, setTotalInfo] = useState(COUPON_DETAIL_TOTAL_INFO);

  const couponDetailInitialTotalInfo = useCouponDetailInitialTotalInfo();

  // QueryData
  const queryClient = useQueryClient();
  const couponDetailList = queryClient.getQueryData<CalculateCouponDetailListQueryResult[]>([
    CALCULATE_QUERY_KEY.CALCULATE_COUPON_DETAIL_LIST,
    user.staffNo,
    ...Object.values(params),
  ]);

  useLayoutEffect(() => {
    if (!couponDetailList || !couponDetailInitialTotalInfo) return;

    const initialSumObj: CouponDetailTotalInfo = deepClone(couponDetailInitialTotalInfo);

    const sumObj = couponDetailList.reduce((arr, cur) => {
      arr[cur.item_type_code].sum += cur.total_amt;

      const 미보전코드 = [99];
      if (!미보전코드.includes(cur.item_type_code)) arr[COUPON_SUM_TYPE.ALL].sum += cur.total_amt;

      return arr;
    }, initialSumObj);

    setTotalInfo(sumObj);
  }, [couponDetailInitialTotalInfo, couponDetailList]);

  return totalInfo;
};

export default useSumCouponDetailTotalInfo;
