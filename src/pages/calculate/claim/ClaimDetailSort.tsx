import { ChangeEventHandler, FC } from 'react';

// Const
import { CLAIM_TAB_TYPE, CLAIM_DETAIL_FILTER_TYPE, CLAIM_FILTER_OPTIONS } from 'constants/calculate/claim';

// Type
import { ClaimTabType } from 'constants/calculate/claim';

// Component
import CalculateDetailFilter from '../component/CalculateDetailFilter';

interface IClaimDetailSort {
  tabType: ClaimTabType;
  filterCondition: {
    [key in ClaimTabType]: Record<string | number, string>;
  };
  handleAllFilterCondition: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
}

const ClaimDetailSort: FC<IClaimDetailSort> = ({ tabType, filterCondition, handleAllFilterCondition }) => {
  return (
    <>
      {tabType === CLAIM_TAB_TYPE.CALCULATE ? (
        <p className="title">사용일시</p>
      ) : (
        <CalculateDetailFilter
          name={CLAIM_DETAIL_FILTER_TYPE.SORT}
          value={filterCondition[tabType][CLAIM_DETAIL_FILTER_TYPE.SORT]}
          options={CLAIM_FILTER_OPTIONS[tabType][CLAIM_DETAIL_FILTER_TYPE.SORT]}
          handleOnChange={handleAllFilterCondition}
        />
      )}
    </>
  );
};

export default ClaimDetailSort;
