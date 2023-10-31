// Type
import { CouponDetailTotalInfo, COUPON_SUM_TYPE } from 'constants/calculate/coupon';
import { CalculateCouponDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

export const sumCouponDetailTotalInfo = (
  initial: CouponDetailTotalInfo,
  datas: CalculateCouponDetailListQueryResult[],
) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (cur.item_type_code in arr) arr[cur.item_type_code].sum += cur.total_amt;

    const 미보전코드 = [99];
    if (!미보전코드.includes(cur.item_type_code)) arr[COUPON_SUM_TYPE.ALL].sum += cur.total_amt;

    return arr;
  }, deepClone(initial));

  return sumObj;
};
