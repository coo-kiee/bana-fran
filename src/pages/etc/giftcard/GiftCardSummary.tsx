import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

const GiftCardSummary = () => {
  const {
    user: { fCode },
  } = useUserInfo();

  let summaryData: Record<string, string> = {
    fran_stock_cnt1: '0',
    fran_stock_amt1: '0',
    fran_stock_cnt3: '0',
    fran_stock_amt3: '0',
    fran_stock_cnt5: '0',
    fran_stock_amt5: '0',
    hq_stock_cnt1: '0',
    hq_stock_amt1: '0',
    hq_stock_cnt3: '0',
    hq_stock_amt3: '0',
    hq_stock_cnt5: '0',
    hq_stock_amt5: '0',
    fran_stock_cnt_total: '0',
    fran_stock_amt_total: '0',
    hq_stock_cnt_total: '0',
    hq_stock_amt_total: '0',
    cnt1_class: '',
    cnt3_class: '',
    cnt5_class: '',
    total_class: '',
  };
  const { data, isSuccess } = ETC_SERVICE.useChkGiftCardStock({ f_code: fCode });

  if (isSuccess) {
    summaryData = {
      fran_stock_cnt1: Utils.numberComma(data.fran_stock_cnt1),
      fran_stock_amt1: Utils.numberComma(data.fran_stock_amt1),
      fran_stock_cnt3: Utils.numberComma(data.fran_stock_cnt3),
      fran_stock_amt3: Utils.numberComma(data.fran_stock_amt3),
      fran_stock_cnt5: Utils.numberComma(data.fran_stock_cnt5),
      fran_stock_amt5: Utils.numberComma(data.fran_stock_amt5),
      hq_stock_cnt1: Utils.numberComma(data.hq_stock_cnt1),
      hq_stock_amt1: Utils.numberComma(data.hq_stock_amt1),
      hq_stock_cnt3: Utils.numberComma(data.hq_stock_cnt3),
      hq_stock_amt3: Utils.numberComma(data.hq_stock_amt3),
      hq_stock_cnt5: Utils.numberComma(data.hq_stock_cnt5),
      hq_stock_amt5: Utils.numberComma(data.hq_stock_amt5),
      fran_stock_cnt_total: Utils.numberComma(data.fran_stock_cnt1 + data.fran_stock_cnt3 + data.fran_stock_cnt5),
      fran_stock_amt_total: Utils.numberComma(data.fran_stock_amt1 + data.fran_stock_amt3 + data.fran_stock_amt5),
      hq_stock_cnt_total: Utils.numberComma(data.hq_stock_cnt1 + data.hq_stock_cnt3 + data.hq_stock_cnt5),
      hq_stock_amt_total: Utils.numberComma(data.hq_stock_amt1 + data.hq_stock_amt3 + data.hq_stock_amt5),
      cnt1_class: data.fran_stock_cnt1 !== data.hq_stock_cnt1 ? 'negative-value' : '',
      cnt3_class: data.fran_stock_cnt3 !== data.hq_stock_cnt3 ? 'negative-value' : '',
      cnt5_class: data.fran_stock_cnt5 !== data.hq_stock_cnt5 ? 'negative-value' : '',
      total_class:
        data.fran_stock_cnt1 + data.fran_stock_cnt3 + data.fran_stock_cnt5 !==
          data.hq_stock_cnt1 + data.hq_stock_cnt3 + data.hq_stock_cnt5 || // 갯수가 다르거나
        data.fran_stock_amt1 + data.fran_stock_amt3 + data.fran_stock_amt5 !==
          data.hq_stock_amt1 + data.hq_stock_amt3 + data.hq_stock_amt5 // 가격이 다른경우
          ? 'negative-value'
          : '',
    };
  }

  return (
    <>
      <tr>
        <td>매장 보유 재고</td>
        <td className={`align-center ${summaryData.cnt1_class}`}>
          {summaryData.fran_stock_cnt1}장 ({summaryData.fran_stock_amt1})
        </td>
        <td className={`align-center ${summaryData.cnt3_class}`}>
          {summaryData.fran_stock_cnt3}장 ({summaryData.fran_stock_amt3})
        </td>
        <td className={`align-center ${summaryData.cnt5_class}`}>
          {summaryData.fran_stock_cnt5}장 ({summaryData.fran_stock_amt5})
        </td>
        <td className={`align-center ${summaryData.total_class}`}>
          {summaryData.fran_stock_cnt_total}장 ({summaryData.fran_stock_amt_total})
        </td>
      </tr>
      <tr>
        <td>본사DB 재고</td>
        <td className={`align-center ${summaryData.cnt1_class}`}>
          {summaryData.hq_stock_cnt1}장 ({summaryData.hq_stock_amt1})
        </td>
        <td className={`align-center ${summaryData.cnt3_class}`}>
          {summaryData.hq_stock_cnt3}장 ({summaryData.hq_stock_amt3})
        </td>
        <td className={`align-center ${summaryData.cnt5_class}`}>
          {summaryData.hq_stock_cnt5}장 ({summaryData.hq_stock_amt5})
        </td>
        <td className={`align-center ${summaryData.total_class}`}>
          {summaryData.hq_stock_cnt_total}장 ({summaryData.hq_stock_amt_total})
        </td>
      </tr>
    </>
  );
};

export default GiftCardSummary;
