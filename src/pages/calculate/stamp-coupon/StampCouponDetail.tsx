import React from 'react';

// Hook
import useStampCouponFilterCondition from 'hooks/calculate/stamp-coupon/useStampCouponFilterCondition';
import useSearchDate from 'hooks/common/useSearchDate';

// Const
import { STAMP_COUPON_DETAIL_FILTER_OPTION, STAMP_COUPON_DETAIL_FILTER_TYPE } from 'constants/calculate/stampCoupon';

// Component
import Calander from 'pages/common/calander';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Select from 'pages/common/select';
import StampCouponDetailTable from './StampCouponDetailTable';

const StampCouponDetail = () => {
  const { filterCondition, handleFilterCondition } = useStampCouponFilterCondition();
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
                  name={STAMP_COUPON_DETAIL_FILTER_TYPE.CHARGE}
                  value={filterCondition[STAMP_COUPON_DETAIL_FILTER_TYPE.CHARGE]}
                  options={STAMP_COUPON_DETAIL_FILTER_OPTION[STAMP_COUPON_DETAIL_FILTER_TYPE.CHARGE]}
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
        <StampCouponDetailTable searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default StampCouponDetail;
