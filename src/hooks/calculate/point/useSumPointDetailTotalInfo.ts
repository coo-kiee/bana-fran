import { useLayoutEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';

// Const
import { POINT_DETAIL_TOTAL_INFO, POINT_SUM_TYPE } from 'constants/calculate/point';

// Type
import { CalculatePointDetailListQueryResult } from 'types/calculate/calculateType';
import { PointDetailTotalInfo } from 'constants/calculate/point';

// Util
import { deepClone } from 'utils/deepClone';

const useSumPointDetailTotalInfo = (
  pointDetailListRes: UseQueryResult<CalculatePointDetailListQueryResult[], unknown>,
) => {
  const [totalInfo, setTotalInfo] = useState<PointDetailTotalInfo>(deepClone(POINT_DETAIL_TOTAL_INFO));

  useLayoutEffect(() => {
    if (!pointDetailListRes.data) return;

    const initialSumObj: PointDetailTotalInfo = deepClone(POINT_DETAIL_TOTAL_INFO);

    const sumObj = pointDetailListRes.data.reduce((arr, cur) => {
      if (cur.bonus_point_type) arr[POINT_SUM_TYPE.BONUS_CHARGE].sum += cur.total_bonus_amt;
      if (cur.use_point_type in arr) arr[cur.use_point_type as keyof PointDetailTotalInfo].sum += cur.total_paid_amt;

      arr[POINT_SUM_TYPE.ALL].sum += cur.total_paid_amt;

      return arr;
    }, initialSumObj);

    setTotalInfo(sumObj);
  }, [pointDetailListRes.data]);

  return totalInfo;
};

export default useSumPointDetailTotalInfo;
