import { useState } from 'react';
import { subMonths } from 'date-fns';
import Utils from 'utils/Utils';

// component
import EtcDetailTable from '../component/EtcDetailTable';
import EtcDetailSummary from '../component/EtcDetailSummary';
import VirtualAccountDetailTable from './VirtualAccountDetailTable';

// type
import { VirtualAccListType, ETC_TAB_TYPE } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST } from 'constants/etc';

// hook
import useSearchDate from 'hooks/common/useSearchDate';
import useUserInfo from 'hooks/user/useUser';
import Calander from 'pages/common/calander';

const VirtualAccountDetail = () => {
  const {
    user: { fCodeName },
  } = useUserInfo();
  const [detailTotalInfo, setDetailTotalInfo] = useState([] as VirtualAccListType[]);
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
    fromDate: subMonths(new Date(), 1),
    toDate: new Date(),
  });

  const summaryResult = [
    {
      title: '충전',
      children: `${Utils.numberComma(
        detailTotalInfo
          .filter((el: any) => el.division === '충전')
          .reduce((acc: any, cur: any) => (acc += cur.deposit), 0) || 0,
      )}원`,
    },
    {
      title: '차감',
      children: `${Utils.numberComma(
        detailTotalInfo
          .filter((el: any) => el.division === '차감')
          .reduce((acc: any, cur: any) => (acc += cur.deposit), 0) || 0,
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
        currentTab={ETC_TAB_TYPE.ACCOUNT}
      />
      <EtcDetailTable
        colgroup={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ACCOUNT].colgroup}
        thead={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ACCOUNT].thead}
        excelOption={{
          fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_가상계좌내역`,
          addRowColor: { rowNums: [1], colors: ['d3d3d3'] },
          colWidths: ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ACCOUNT].colgroup.map(({ width }) => ({
            wpx: width !== '*' ? Number(((Number(width.replace('%', '')) * 1540) / 100).toFixed(2)) : 400,
          })),
        }}
      >
        <VirtualAccountDetailTable searchDate={searchDate} setDetailTotalInfo={setDetailTotalInfo} />
      </EtcDetailTable>
    </>
  );
};

export default VirtualAccountDetail;
