import { FC } from 'react';

// component
import Calander from 'pages/common/calander';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import MusicChargeDetailTable from './MusicChargeDetailTable';
import EtcDetailTableFallback from '../component/EtcDetailTableFallback';

// hook
import useSearchDate from 'hooks/common/useSearchDate';

// type, constant
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const MusicChargeDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({ dateFormat: 'yyyy-MM' });

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
              조회
            </button>
          )}
          dateFormat={'yyyy-MM'}
          showMonthYearPicker
        />
      </div>

      <PageInfoProvider fallbackComponent={() => <EtcDetailTableFallback tabType={tabType} />}>
        <MusicChargeDetailTable tabType={tabType} searchDate={searchDate} />
      </PageInfoProvider>
    </>
  );
};

export default MusicChargeDetail;
