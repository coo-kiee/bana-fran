// Const
import { COUPON_DETAIL_FILTER_OPTION, COUPON_DETAIL_FILTER_TYPE } from 'constants/calculate/coupon';

// Hook
import useCouponFilterCondition from 'hooks/calculate/coupon/useCouponFilterCondition';
import useCouponFilters from 'hooks/calculate/coupon/useCouponFilters';
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Select from '../../common/select';
import CouponDetailTable from './CouponDetailTable';
import Calander from 'pages/common/calander';

const CouponDetail = () => {
  const couponFilters = useCouponFilters();

  const { filterCondition, handleFilterCondition } = useCouponFilterCondition();
  const { searchDate, handleSearchDate } = useSearchDate();

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <>
              <div className="select-wrap">
                <Select
                  name={COUPON_DETAIL_FILTER_TYPE.COUPON}
                  value={filterCondition[COUPON_DETAIL_FILTER_TYPE.COUPON]}
                  options={couponFilters}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
                <Select
                  name={COUPON_DETAIL_FILTER_TYPE.DEVICE}
                  value={filterCondition[COUPON_DETAIL_FILTER_TYPE.DEVICE]}
                  options={COUPON_DETAIL_FILTER_OPTION[COUPON_DETAIL_FILTER_TYPE.DEVICE]}
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
        <CouponDetailTable searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default CouponDetail;
