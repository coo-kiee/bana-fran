import { ChangeEventHandler, FC } from 'react';

// Const
import { CLAIM_TAB_TYPE, CLAIM_DETAIL_FILTER_TYPE, CLAIM_DETAIL_FILTER_OPTION } from 'constants/calculate/claim';

// Type
import { ClaimTabType } from 'constants/calculate/claim';

// Component
import Select from '../../common/select';

interface IClaimDetailSort {
  tabType: ClaimTabType;
  filterCondition: Record<string | number, string>;
  handleFilterCondition: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
}

const ClaimDetailSort: FC<IClaimDetailSort> = ({ tabType, filterCondition, handleFilterCondition }) => {
  return (
    <>
      {tabType === CLAIM_TAB_TYPE.CALCULATE ? (
        <p className="title">사용일시</p>
      ) : (
        <Select
          name={CLAIM_DETAIL_FILTER_TYPE.SORT}
          value={filterCondition[CLAIM_DETAIL_FILTER_TYPE.SORT]}
          options={CLAIM_DETAIL_FILTER_OPTION[tabType][CLAIM_DETAIL_FILTER_TYPE.SORT]}
          handleOnChange={handleFilterCondition}
        />
      )}
    </>
  );
};

export default ClaimDetailSort;
