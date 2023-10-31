// Type
import { PointDetailTotalInfo, POINT_SUM_TYPE } from 'constants/calculate/point';
import { CalculatePointDetailListQueryResult } from 'types/calculate/calculateType';

// Util
import { deepClone } from 'utils/deepClone';

export const sumPointDetailTotalInfo = (
  initial: PointDetailTotalInfo,
  datas: CalculatePointDetailListQueryResult[],
) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (cur.bonus_point_type) arr[POINT_SUM_TYPE.BONUS_CHARGE].sum += cur.total_bonus_amt;
    if (cur.use_point_type in arr) arr[cur.use_point_type as keyof PointDetailTotalInfo].sum += cur.total_paid_amt;

    arr[POINT_SUM_TYPE.ALL].sum += cur.total_bonus_amt;
    arr[POINT_SUM_TYPE.ALL].sum += cur.total_paid_amt;

    return arr;
  }, deepClone(initial));

  return sumObj;
};
