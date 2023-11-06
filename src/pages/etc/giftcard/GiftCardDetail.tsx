import { useState } from 'react';
import { subMonths } from 'date-fns';
import Utils from 'utils/Utils';

// component
import EtcDetailTable from '../component/EtcDetailTable';
import EtcDetailSummary from '../component/EtcDetailSummary';
import GiftCardDetailTable from './GiftCardDetailTable';
import Calander from 'pages/common/calander';
import Select from 'pages/common/select';

// hook
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';
import useGiftcardOption from 'hooks/etc/useGiftcardOption';

// type, constants
import { GiftCardDetailType, ETC_TAB_TYPE } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST, ETC_GIFTCARD_FILTER_OPTION, ETC_GIFTCARD_FILTER_TYPE } from 'constants/etc';

const GiftCardDetail = () => {
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
    fromDate: subMonths(new Date(), 1), // 2022-10
    toDate: new Date(), // 2022-11
  });
  const { filterCondition, handleFilterCondition } = useGiftcardOption();
  const [detailTotalInfo, setDetailTotalInfo] = useState([] as GiftCardDetailType[]);

  const summaryResult = [
    {
      title: '키오스크/POS 판매금액 합계',
      children: `${Utils.numberComma(
        detailTotalInfo
          .filter((el: any) => (el.rcp_type === '키오스크' || el.rcp_type === 'POS') && el.gubun === '판매')
          .reduce((acc: any, cur: any) => (acc += cur.item_amt), 0) || 0,
      )}원`,
    },
    {
      title: '어플 판매금액 합계',
      children: `${Utils.numberComma(
        detailTotalInfo
          .filter((el: any) => el.rcp_type === '어플' && el.gubun === '판매')
          .reduce((acc: any, cur: any) => (acc += cur.item_amt), 0) || 0,
      )}원`,
    },
    {
      title: '판매취소(폐기)금액 합계',
      children: `${Utils.numberComma(
        detailTotalInfo
          .filter((el: any) => el.gubun === '판매취소(폐기)')
          .reduce((acc: any, cur: any) => (acc += cur.item_amt), 0) || 0,
      )}원`,
    },
  ];
  const etcGiftcardListKey = [
    'etc_gift_card_list',
    JSON.stringify({ fCode, from: searchDate.fromDate, to: searchDate.toDate }),
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
                  name={ETC_GIFTCARD_FILTER_TYPE.POINT}
                  value={filterCondition[ETC_GIFTCARD_FILTER_TYPE.POINT]}
                  options={ETC_GIFTCARD_FILTER_OPTION[ETC_GIFTCARD_FILTER_TYPE.POINT]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
                <Select
                  name={ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE}
                  value={filterCondition[ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE]}
                  options={ETC_GIFTCARD_FILTER_OPTION[ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
                <Select
                  name={ETC_GIFTCARD_FILTER_TYPE.DEVICE}
                  value={filterCondition[ETC_GIFTCARD_FILTER_TYPE.DEVICE]}
                  options={ETC_GIFTCARD_FILTER_OPTION[ETC_GIFTCARD_FILTER_TYPE.DEVICE]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
              </div>
              <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
                조회
              </button>
            </>
          )}
          dateFormat={'yyyy-MM'}
          showMonthYearPicker
        />
      </div>

      <EtcDetailSummary
        searchDate={`${searchDate.fromDate} ~ ${searchDate.toDate}`}
        summaryResult={summaryResult}
        currentTab={ETC_TAB_TYPE.GIFTCARD}
      />

      <EtcDetailTable
        colgroup={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.GIFTCARD].colgroup}
        thead={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.GIFTCARD].thead}
        excelOption={{
          fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_상품권내역`,
          addRowColor: { rowNums: [1], colors: ['d3d3d3'] },
        }}
      >
        <GiftCardDetailTable
          etcGiftcardListKey={etcGiftcardListKey}
          filterCondition={filterCondition}
          searchDate={searchDate}
          setDetailTotalInfo={setDetailTotalInfo}
        />
      </EtcDetailTable>
    </>
  );
};

export default GiftCardDetail;
