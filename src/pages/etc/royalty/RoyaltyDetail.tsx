import { FC } from 'react';

// component
import RoyaltyDetailTable from './RoyaltyDetailTable';
import Calander from 'pages/common/calander';

// type, constants
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// hook
import useSearchDate from 'hooks/common/useSearchDate';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';

const RoyaltyDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
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

      {/* <EtcDetailSummary
        searchDate={`${searchDate.fromDate} ~ ${searchDate.toDate}`}
        summaryResult={summaryResult}
        currentTab={ETC_TAB_TYPE.ROYALTY}
      />
      <EtcDetailTable
        colgroup={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ROYALTY].colgroup}
        thead={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ROYALTY].thead}
        excelOption={{
          fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_로열티내역`,
          addRowColor: { rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] },
        }}
      >
        <RoyaltyDetailTable searchDate={searchDate} setDetailTotalInfo={setDetailTotalInfo} />
      </EtcDetailTable> */}
      <PageInfoProvider>
        <RoyaltyDetailTable searchDate={searchDate} tabType={tabType} />
      </PageInfoProvider>
    </>
  );
};

export default RoyaltyDetail;
