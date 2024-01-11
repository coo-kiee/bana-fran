// Type

import { BanaPointDetailTotalInfo, BANA_POINT_CHARGE_MULTIPLY } from 'constants/calculate/banaPoint';
import { CalculateBanaPointDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

export const sumBanaPointDetailTotalInfo = (
  initial: BanaPointDetailTotalInfo,
  datas: CalculateBanaPointDetailListQueryResult[],
) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (cur.calc_type in arr) {
      arr[cur.calc_type as keyof BanaPointDetailTotalInfo].sum +=
        cur.total_amt * BANA_POINT_CHARGE_MULTIPLY[cur.calc_type];
    }

    return arr;
  }, deepClone(initial));

  return sumObj;
};
