// Type
import { AffiliateDetailTotalInfo, AFFILIATE_SUM_TYPE } from 'constants/calculate/affiliate';
import { CalculateAffiliateDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

export const sumAffiliateDetailTotalInfo = (
  initial: AffiliateDetailTotalInfo,
  datas: CalculateAffiliateDetailListQueryResult[],
) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (AFFILIATE_SUM_TYPE.USE in arr) arr[AFFILIATE_SUM_TYPE.USE].sum += cur.apply_charge;

    return arr;
  }, deepClone(initial));

  return sumObj;
};
