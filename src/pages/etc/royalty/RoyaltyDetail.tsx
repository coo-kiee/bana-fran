import { useState } from 'react';
import Utils from 'utils/Utils';

// component
import EtcDetailTable from '../component/EtcDetailTable';
import EtcDetailSummary from '../component/EtcDetailSummary';
import RoyaltyDetailTable from './RoyaltyDetailTable';
import Calander from 'pages/common/calander';

// type, constants
import { RoyaltyDetailListType, ETC_TAB_TYPE } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST } from 'constants/etc';

// hook
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';

const RoyaltyDetail = () => {
  const {
    user: { fCodeName },
  } = useUserInfo();
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
  });
  const [detailTotalInfo, setDetailTotalInfo] = useState([] as RoyaltyDetailListType[]);

  const summaryResult = [
    {
      title: '로열티 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: any, cur: any) => (acc += cur.total_amount), 0) || 0,
      )}원`,
    },
  ];

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

      <EtcDetailSummary
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
      </EtcDetailTable>
    </>
  );
};

export default RoyaltyDetail;
