import { useState, useLayoutEffect } from 'react';

// Const
import { ClaimFilterOption, CLAIM_DETAIL_FILTER_OPTION } from 'constants/calculate/claim';

// Hook
import useOnChange from 'hooks/useOnChange';

// Type
import { CLAIM_TAB_TYPE } from 'types/calculate/calculateType';

const useClaimFilterCondition = () => {
  const [allFilterCondition, setAllFilterCondition] = useState(
    Object.entries(CLAIM_DETAIL_FILTER_OPTION[CLAIM_TAB_TYPE.ALL]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof ClaimFilterOption[typeof CLAIM_TAB_TYPE.ALL], string>,
    ),
  );
  const handleAllFilterCondition = useOnChange(setAllFilterCondition);

  const [filterCondition, setFilterCondition] = useState({
    [CLAIM_TAB_TYPE.ALL]: allFilterCondition,
    [CLAIM_TAB_TYPE.CALCULATE]: {},
  });

  useLayoutEffect(() => {
    setFilterCondition((prev) => ({ ...prev, [CLAIM_TAB_TYPE.ALL]: allFilterCondition }));
  }, [allFilterCondition]);

  return { filterCondition, handleAllFilterCondition };
};

export default useClaimFilterCondition;
