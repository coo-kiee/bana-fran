import { useState } from 'react';

// hook
import useOnChange from 'hooks/useOnChange';

// constants, type
import { ETC_GIFTCARD_FILTER_OPTION, giftcardFilterOption } from 'constants/etc';
import { GiftCardDetailType } from 'types/etc/etcType';

const useGiftcardOption = () => {
  const [filterCondition, setFilterCondition] = useState(
    Object.entries(ETC_GIFTCARD_FILTER_OPTION).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof giftcardFilterOption, string>,
    ),
  );

  const handleFilterCondition = useOnChange(setFilterCondition);

  const [filterData] = useState(() => (condition: typeof filterCondition, data: GiftCardDetailType) => {
    return Object.values(condition).every(
      (item) => !item || [data.gubun, String(data.menu_Item), data.rcp_type].includes(item),
    );
  });

  return { filterCondition, handleFilterCondition, filterData };
};

export default useGiftcardOption;
