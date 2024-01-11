import { useState } from 'react';

// Const
import { BanaPointDetailFilterOption, BANA_POINT_DETAIL_FILTER_OPTION } from 'constants/calculate/banaPoint';

// Type
import { CalculateBanaPointDetailListQueryResult } from 'types/calculate/calculateType';

// Hook
import useOnChange from 'hooks/useOnChange';

const useBanaPointFilterCondition = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(BANA_POINT_DETAIL_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof BanaPointDetailFilterOption, string>,
    ),
  );
  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: CalculateBanaPointDetailListQueryResult) => {
      return Object.values(condition).every((item) => !item || [data.calc_type].includes(item));
    },
  );

  return { filterCondition, handleFilterCondition, filterData };
};

export default useBanaPointFilterCondition;
