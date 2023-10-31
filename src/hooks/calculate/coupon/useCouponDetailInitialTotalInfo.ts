import { useQueryClient } from 'react-query';

// Hook
import useUserInfo from 'hooks/user/useUser';

// Const
import { COUPON_DETAIL_TOTAL_INFO } from 'constants/calculate/coupon';

// Type
import { CalculateCouponListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

// API
import { CALCULATE_QUERY_KEY } from 'service/calculateService';

const useCouponDetailInitialTotalInfo = () => {
  const { user } = useUserInfo();

  const queryClient = useQueryClient();
  const calculateCouponListData = queryClient.getQueryData<CalculateCouponListQueryResult[]>([
    CALCULATE_QUERY_KEY.CALCULATE_COUPON_LIST,
    { f_code: user.fCode },
    user,
  ]);

  const couponDetailTotalInfo = calculateCouponListData?.reduce((arr, cur) => {
    arr[cur.code] = { title: cur.code_name, sum: 0 };

    return arr;
  }, deepClone(COUPON_DETAIL_TOTAL_INFO));

  return couponDetailTotalInfo || COUPON_DETAIL_TOTAL_INFO;
};

export default useCouponDetailInitialTotalInfo;
