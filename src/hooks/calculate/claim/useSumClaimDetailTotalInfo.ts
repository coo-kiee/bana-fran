import { useLayoutEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';

// Const
import { CLAIM_SUM_TYPE, ClaimDetailTotalInfo, CLAIM_DETAIL_TOTAL_INFO } from 'constants/calculate/claim';

// Type
import { CalculateClaimDetailListQueryResult } from 'types/calculate/calculateType';
import { ClaimTabType } from 'constants/calculate/claim';

// Util
import { deepClone } from 'utils/deepClone';

interface IUseSumClaimTotalInfo {
  tabType: ClaimTabType;
  claimDetailListRes: UseQueryResult<CalculateClaimDetailListQueryResult[], unknown>;
}
const useSumClaimDetailTotalInfo = ({ tabType, claimDetailListRes }: IUseSumClaimTotalInfo) => {
  const [totalInfo, setTotalInfo] = useState<ClaimDetailTotalInfo>(CLAIM_DETAIL_TOTAL_INFO[tabType]);

  useLayoutEffect(() => {
    if (!claimDetailListRes.data) return;

    const initialSumObj: ClaimDetailTotalInfo = deepClone(CLAIM_DETAIL_TOTAL_INFO[tabType]);

    const selectSumValue = (data: CalculateClaimDetailListQueryResult) => {
      switch (data.use_flag) {
        case CLAIM_SUM_TYPE.USE:
          return data.coupon_charge;
        case CLAIM_SUM_TYPE.EXPIRATION:
          return data.coupon_amt;
        default:
          return 0;
      }
    };

    const sumObj = claimDetailListRes.data.reduce((arr, cur) => {
      if (CLAIM_SUM_TYPE.PUBLISH in arr) arr[CLAIM_SUM_TYPE.PUBLISH].sum += cur.coupon_amt;
      if (cur.use_flag in arr) arr[cur.use_flag as keyof ClaimDetailTotalInfo].sum += selectSumValue(cur);
      return arr;
    }, initialSumObj);

    setTotalInfo(sumObj);
  }, [claimDetailListRes.data, tabType]);

  return totalInfo;
};

export default useSumClaimDetailTotalInfo;
