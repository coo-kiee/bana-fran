import { useState } from 'react';

// hook
import useOnChange from 'hooks/useOnChange';

// type, constants
import { OrderDetailListExcelType, OrderDetailListType } from 'types/etc/etcType';
import { ETC_ORDER_FILTER_OPTION, orderFilterOption } from 'constants/etc';

const useOrderOption = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(ETC_ORDER_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof orderFilterOption, string>,
    ),
  );

  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: OrderDetailListType | OrderDetailListExcelType) => {
      return Object.values(condition).every((item) => !item || [String(data.state)].includes(item));
    },
  );

  return { filterCondition, handleFilterCondition, filterData };
};

export default useOrderOption;
