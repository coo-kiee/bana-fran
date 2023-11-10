import { useState } from 'react';

// Type
import { BoardFilterOption, BoardTab, BOARD_FILTER_OPTION, BOARD_TAB } from 'constants/board';

// Hook
import useOnChange from 'hooks/useOnChange';

const useBoardFilterCondition = (tabType: BoardTab) => {
  const [managementFilterCondition, setManagementFilterCondition] = useState(
    Object.entries(BOARD_FILTER_OPTION[BOARD_TAB.MANAGEMENT]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof BoardFilterOption[typeof BOARD_TAB.MANAGEMENT], number>,
    ),
  );
  const handleManagementFilterCondition = useOnChange(setManagementFilterCondition);

  const [educationFilterCondition, setEducationFilterCondition] = useState(
    Object.entries(BOARD_FILTER_OPTION[BOARD_TAB.EDUCATION]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof BoardFilterOption[typeof BOARD_TAB.EDUCATION], number>,
    ),
  );
  const handleEducationFilterCondition = useOnChange(setEducationFilterCondition);

  const [recipeFilterCondition, setRecipeFilterCondition] = useState(
    Object.entries(BOARD_FILTER_OPTION[BOARD_TAB.RECIPE]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof BoardFilterOption[typeof BOARD_TAB.RECIPE], number>,
    ),
  );
  const handleRecipeFilterCondition = useOnChange(setRecipeFilterCondition);

  const [ruleFilterCondition, setRuleFilterCondition] = useState(
    Object.entries(BOARD_FILTER_OPTION[BOARD_TAB.RULE]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof BoardFilterOption[typeof BOARD_TAB.RULE], number>,
    ),
  );
  const handleRuleFilterCondition = useOnChange(setRuleFilterCondition);

  switch (tabType) {
    case BOARD_TAB.EDUCATION:
      return { filterCondition: educationFilterCondition, handleFilterCondition: handleEducationFilterCondition };
    case BOARD_TAB.RECIPE:
      return { filterCondition: recipeFilterCondition, handleFilterCondition: handleRecipeFilterCondition };
    case BOARD_TAB.RULE:
      return { filterCondition: ruleFilterCondition, handleFilterCondition: handleRuleFilterCondition };
    default:
      return { filterCondition: managementFilterCondition, handleFilterCondition: handleManagementFilterCondition };
  }
};

export default useBoardFilterCondition;
