import { useState } from 'react';

// Const
import { ClaimFilterOption, ClaimTabType, CLAIM_DETAIL_FILTER_OPTION, CLAIM_TAB_TYPE } from 'constants/calculate/claim';

// Hook
import useOnChange from 'hooks/useOnChange';

const useClaimFilterCondition = (tabType: ClaimTabType) => {
  const [allFilterCondition, setAllFilterCondition] = useState(
    Object.entries(CLAIM_DETAIL_FILTER_OPTION[CLAIM_TAB_TYPE.ALL]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof ClaimFilterOption[typeof CLAIM_TAB_TYPE.ALL], string>,
    ),
  );
  const handleAllFilterCondition = useOnChange(setAllFilterCondition);

  return {
    filterCondition: tabType ? allFilterCondition : {},
    handleFilterCondition: tabType ? handleAllFilterCondition : handleAllFilterCondition,
  };
};

export default useClaimFilterCondition;
