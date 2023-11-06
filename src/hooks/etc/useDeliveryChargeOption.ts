import { useState } from 'react';

// hook
import useOnChange from 'hooks/useOnChange';

// constants, type
import { ETC_DELIVERY_CHARGE_FILTER_OPTION, deliveryChargeFilterOption } from 'constants/etc';
import { DeliveryDetailListType } from 'types/etc/etcType';

const useDeliveryChargeOption = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(ETC_DELIVERY_CHARGE_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof deliveryChargeFilterOption, string>,
    ),
  );

  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(() => (condition: typeof filterCondition, data: DeliveryDetailListType) => {
    return Object.values(condition).every((item) => !item || [data.delivery_pay_type].includes(item));
  });

  return { filterCondition, handleFilterCondition, filterData };
};

export default useDeliveryChargeOption;
