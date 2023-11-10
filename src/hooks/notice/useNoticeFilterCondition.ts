import { useState } from 'react';

// Type
import { NoticeFilterOption, NoticeTab, NOTICE_FILTER_OPTION, NOTICE_TAB } from 'constants/notice';

// Hook
import useOnChange from 'hooks/useOnChange';

const useNoticeFilterCondition = (tabType: NoticeTab) => {
  const [normalFilterCondition, setNormalFilterCondition] = useState(
    Object.entries(NOTICE_FILTER_OPTION[NOTICE_TAB.NORMAL]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof NoticeFilterOption[typeof NOTICE_TAB.NORMAL], number>,
    ),
  );
  const handleNormalFilterCondition = useOnChange(setNormalFilterCondition);

  const [calculateFilterCondition, setCalculateFilterCondition] = useState(
    Object.entries(NOTICE_FILTER_OPTION[NOTICE_TAB.CALCULATE]).reduce(
      (arr, [key, value]) => ({ ...arr, [key]: value[0].value }),
      {} as Record<keyof NoticeFilterOption[typeof NOTICE_TAB.CALCULATE], number>,
    ),
  );
  const handleCalculateFilterCondition = useOnChange(setCalculateFilterCondition);

  return {
    filterCondition: tabType === NOTICE_TAB.NORMAL ? normalFilterCondition : calculateFilterCondition,
    handleFilterCondition: tabType === NOTICE_TAB.NORMAL ? handleNormalFilterCondition : handleCalculateFilterCondition,
  };
};

export default useNoticeFilterCondition;
