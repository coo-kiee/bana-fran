// Type

import { StampCouponDetailTotalInfo, STAMP_COUPON_CHARGE_MULTIPLY } from 'constants/calculate/stampCoupon';
import { CalculateStampCouponDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

export const sumStampCouponDetailTotalInfo = (
  initial: StampCouponDetailTotalInfo,
  datas: CalculateStampCouponDetailListQueryResult[],
) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (cur.calc_type in arr) {
      arr[cur.calc_type as keyof StampCouponDetailTotalInfo].sum +=
        cur.total_amt * STAMP_COUPON_CHARGE_MULTIPLY[cur.calc_type];
    }

    return arr;
  }, deepClone(initial));

  return sumObj;
};
