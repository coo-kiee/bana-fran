import { FC } from 'react';
import { subMonths } from 'date-fns';

// component
import VirtualAccountDetailTable from './VirtualAccountDetailTable';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// hook
import useSearchDate from 'hooks/common/useSearchDate';
import Calander from 'pages/common/calander';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';

const VirtualAccountDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
    fromDate: subMonths(new Date(), 1),
    toDate: new Date(),
  });

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

      <PageInfoProvider>
        <VirtualAccountDetailTable searchDate={searchDate} tabType={tabType} />
      </PageInfoProvider>
    </>
  );
};

export default VirtualAccountDetail;
