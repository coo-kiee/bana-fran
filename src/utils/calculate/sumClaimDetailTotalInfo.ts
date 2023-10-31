// Type
import { ClaimDetailTotalInfo, CLAIM_SUM_TYPE } from 'constants/calculate/claim';
import { CalculateClaimDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

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

export const sumClaimDetailTotalInfo = (
  initial: ClaimDetailTotalInfo,
  datas: CalculateClaimDetailListQueryResult[],
) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (CLAIM_SUM_TYPE.PUBLISH in arr) arr[CLAIM_SUM_TYPE.PUBLISH].sum += cur.coupon_amt;
    if (cur.use_flag in arr) arr[cur.use_flag as keyof ClaimDetailTotalInfo].sum += selectSumValue(cur);

    return arr;
  }, deepClone(initial));

  return sumObj;
};
