// Type

import { EtcDetailTotalInfo, ETC_CHARGE_MULTIPLY } from 'constants/calculate/etc';
import { CalculateEtcDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

export const sumEtcDetailTotalInfo = (initial: EtcDetailTotalInfo, datas: CalculateEtcDetailListQueryResult[]) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (cur.calculate_type in arr) {
      arr[cur.calculate_type as keyof EtcDetailTotalInfo].sum +=
        cur.total_amt * ETC_CHARGE_MULTIPLY[cur.calculate_type];
    }

    return arr;
  }, deepClone(initial));

  return sumObj;
};
