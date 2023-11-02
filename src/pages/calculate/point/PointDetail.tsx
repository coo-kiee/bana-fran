// Const
import { POINT_DETAIL_FILTER_OPTION, POINT_DETAIL_FILTER_TYPE } from 'constants/calculate/point';

// Hook
import usePointFilterCondition from 'hooks/calculate/point/usePointFilterCondition';
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import PointDetailTable from './PointDetailTable';
import Select from '../../common/select';
import Calander from 'pages/common/calander';

const PointDetail = () => {
  const { filterCondition, handleFilterCondition } = usePointFilterCondition();
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
                  name={POINT_DETAIL_FILTER_TYPE.POINT}
                  value={filterCondition[POINT_DETAIL_FILTER_TYPE.POINT]}
                  options={POINT_DETAIL_FILTER_OPTION[POINT_DETAIL_FILTER_TYPE.POINT]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
                <Select
                  name={POINT_DETAIL_FILTER_TYPE.DEVICE}
                  value={filterCondition[POINT_DETAIL_FILTER_TYPE.DEVICE]}
                  options={POINT_DETAIL_FILTER_OPTION[POINT_DETAIL_FILTER_TYPE.DEVICE]}
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
        <PointDetailTable searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default PointDetail;
