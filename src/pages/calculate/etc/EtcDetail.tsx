// Const
import { ETC_DETAIL_FILTER_OPTION, ETC_DETAIL_FILTER_TYPE } from 'constants/calculate/etc';

// Hook
import useSearchDate from 'hooks/common/useSearchDate';
import useEtcFilterCondition from 'hooks/calculate/etc/useEtcFilterCondition';

// Component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Select from '../../common/select';
import EtcDetailTable from './EtcDetailTable';
import Calander from 'pages/common/calander';

const EtcDetail = () => {
  const { filterCondition, handleFilterCondition } = useEtcFilterCondition();
  const { searchDate, handleSearchDate } = useSearchDate({ dateFormat: 'yyyy-MM' });

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          dateFormat="yyyy-MM"
          showMonthYearPicker
          render={({ fromDate, toDate }) => (
            <>
              <div className="select-wrap">
                <Select
                  name={ETC_DETAIL_FILTER_TYPE.CHARGE}
                  value={filterCondition[ETC_DETAIL_FILTER_TYPE.CHARGE]}
                  options={ETC_DETAIL_FILTER_OPTION[ETC_DETAIL_FILTER_TYPE.CHARGE]}
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
        <EtcDetailTable searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default EtcDetail;
