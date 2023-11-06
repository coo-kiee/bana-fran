import { useState } from 'react';
import Utils from 'utils/Utils';

// type
import { DeliveryDetailListType, ETC_TAB_TYPE } from 'types/etc/etcType';

// component
import DeliveryChargeDetailTable from './DeliveryChargeDetailTable';
import EtcDetailTable from '../component/EtcDetailTable';
import EtcDetailSummary from '../component/EtcDetailSummary';
import Select from 'pages/common/select';
import Calander from 'pages/common/calander';

// hook
import useUserInfo from 'hooks/user/useUser';
import useDeliveryChargeOption from 'hooks/etc/useDeliveryChargeOption';
import useSearchDate from 'hooks/common/useSearchDate';

// constant
import { ETC_COL_THEAD_LIST, ETC_DELIVERY_CHARGE_FILTER_OPTION, ETC_DELIVERY_CHARGE_FILTER_TYPE } from 'constants/etc';

const DeliveryChargeDetail = () => {
  const {
    user: { fCodeName },
  } = useUserInfo();
  const { searchDate, handleSearchDate } = useSearchDate();
  const [detailTotalInfo, setDetailTotalInfo] = useState([] as DeliveryDetailListType[]);
  const { filterCondition, handleFilterCondition } = useDeliveryChargeOption();

  const summaryResult = [
    {
      title: '바나 딜리버리 주문금액 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: number, cur: any) => (acc += cur.total_charge), 0) || 0,
      )}원`,
    },
    {
      title: '바나 딜리버리 수수료 공급가(주문금액*2%) 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: number, cur: any) => (acc += cur.suply_fee), 0) || 0,
      )}원`,
    },
    {
      title: '바나 딜리버리 수수료(수수료 공급가+부가세) 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: number, cur: any) => (acc += cur.suply_fee + cur.suply_fee_tax), 0) || 0,
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
            <>
              <div className="select-wrap">
                <Select
                  name={ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE}
                  value={filterCondition[ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE]}
                  options={ETC_DELIVERY_CHARGE_FILTER_OPTION[ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE]}
                  handleOnChange={handleFilterCondition}
                />
              </div>
              <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
                조회
              </button>
            </>
          )}
        />
      </div>

      <EtcDetailSummary
        searchDate={`${searchDate.fromDate} ~ ${searchDate.toDate}`}
        summaryResult={summaryResult}
        currentTab={ETC_TAB_TYPE.DELIVERY}
      />

      <EtcDetailTable
        colgroup={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.DELIVERY].colgroup}
        thead={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.DELIVERY].thead}
        excelOption={{
          fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_딜리버리수수료내역`,
          addRowColor: { rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] },
        }}
      >
        <DeliveryChargeDetailTable
          searchDate={searchDate}
          filterCondition={filterCondition}
          setDetailTotalInfo={setDetailTotalInfo}
        />
      </EtcDetailTable>
    </>
  );
};

export default DeliveryChargeDetail;
