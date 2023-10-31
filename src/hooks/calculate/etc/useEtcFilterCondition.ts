import { useState } from 'react';

// Const
import { EtcDetailFilterOption, ETC_DETAIL_FILTER_OPTION } from 'constants/calculate/etc';

// Type
import { CalculateEtcDetailListQueryResult } from 'types/calculate/calculateType';

// Hook
import useOnChange from 'hooks/useOnChange';

const useEtcFilterCondition = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(ETC_DETAIL_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof EtcDetailFilterOption, string>,
    ),
  );
  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(() => (condition: typeof filterCondition, data: CalculateEtcDetailListQueryResult) => {
    return Object.values(condition).every((item) => !item || [data.calculate_type].includes(item));
  });

  return { filterCondition, handleFilterCondition, filterData };
};

export default useEtcFilterCondition;
