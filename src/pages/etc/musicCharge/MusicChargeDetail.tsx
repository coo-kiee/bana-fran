import { useState } from 'react';
import Utils from 'utils/Utils';

// component
import MusicChargeDetailTable from './MusicChargeDetailTable';
import EtcDetailSummary from '../component/EtcDetailSummary';
import EtcDetailTable from '../component/EtcDetailTable';
import Calander from 'pages/common/calander';

// hook
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';

// type, constant
import { ETC_TAB_TYPE, MusicChargeDetailType } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST } from 'constants/etc';

const MusicChargeDetail = () => {
  const {
    user: { fCodeName },
  } = useUserInfo();
  const { searchDate, handleSearchDate } = useSearchDate({ dateFormat: 'yyyy-MM' });
  const [detailTotalInfo, setDetailTotalInfo] = useState([] as MusicChargeDetailType[]);

  const summaryResult = [
    {
      title: '음악 사용료 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce(
          (acc: number, { state, total_amount }: MusicChargeDetailType) =>
            state.includes('음악') ? (acc += total_amount) : acc,
          0,
        ) || 0,
      )}원`,
    },
    {
      title: '공원권료 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce(
          (acc: number, { state, total_amount }: MusicChargeDetailType) =>
            state.includes('공연') ? (acc += total_amount) : acc,
          0,
        ) || 0,
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
        currentTab={ETC_TAB_TYPE.MUSIC}
      />
      <EtcDetailTable
        colgroup={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.MUSIC].colgroup}
        thead={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.MUSIC].thead}
        excelOption={{
          fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_음악서비스내역`,
          addRowColor: { rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] },
        }}
      >
        <MusicChargeDetailTable searchDate={searchDate} setDetailTotalInfo={setDetailTotalInfo} />
      </EtcDetailTable>
    </>
  );
};

export default MusicChargeDetail;
