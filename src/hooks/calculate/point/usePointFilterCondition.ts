import { useState } from 'react';

// Const
import { POINT_DETAIL_FILTER_OPTION } from 'constants/calculate/point';

// Type
import { PointDetailFilterOption } from 'constants/calculate/point';
import { CalculatePointDetailListQueryResult } from 'types/calculate/calculateType';

// Hook
import useOnChange from 'hooks/useOnChange';

const usePointFilterCondition = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(POINT_DETAIL_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof PointDetailFilterOption, string>,
    ),
  );
  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: CalculatePointDetailListQueryResult) => {
      return Object.values(condition).every(
        (item) => !item || [data.use_point_type, data.bonus_point_type, data.rcp_type].includes(item),
      );
    },
  );

  return { filterCondition, handleFilterCondition, filterData };
};

export default usePointFilterCondition;
