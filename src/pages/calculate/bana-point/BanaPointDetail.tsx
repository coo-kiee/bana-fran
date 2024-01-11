import React from 'react';

// Hook
import useBanaPointFilterCondition from 'hooks/calculate/bana-point/useBanaPointFilterCondition';
import useSearchDate from 'hooks/common/useSearchDate';

// Const
import { BANA_POINT_DETAIL_FILTER_OPTION, BANA_POINT_DETAIL_FILTER_TYPE } from 'constants/calculate/banaPoint';

// Component
import Calander from 'pages/common/calander';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import BanaPointDetailTable from './BanaPointDetailTable';
import Select from 'pages/common/select';

const BanaPointDetail = () => {
  const { filterCondition, handleFilterCondition } = useBanaPointFilterCondition();
  const { searchDate, handleSearchDate } = useSearchDate();

  return (
    <>
      <div className="search-wrap">
        <p className="title">상세 내역</p>
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <>
              <div className="select-wrap">
                <Select
                  name={BANA_POINT_DETAIL_FILTER_TYPE.CHARGE}
                  value={filterCondition[BANA_POINT_DETAIL_FILTER_TYPE.CHARGE]}
                  options={BANA_POINT_DETAIL_FILTER_OPTION[BANA_POINT_DETAIL_FILTER_TYPE.CHARGE]}
                  handleOnChange={handleFilterCondition}
                />
              </div>
              <button className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
                조회
              </button>
            </>
          )}
        />
      </div>
      <PageInfoProvider>
        <BanaPointDetailTable searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default BanaPointDetail;
