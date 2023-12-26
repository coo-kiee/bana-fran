import { useState, useEffect } from 'react';
import { Bit } from 'types/common';
import {
  HISTORY_ORDER_STATE,
  HISTORY_ORDER_TYPE,
  HISTORY_RCP_TYPE,
  SalesHistoryData,
  SalesHistorySearchOption,
} from 'types/sales/salesType';

interface UseSalesHistoryDataProps {
  data: SalesHistoryData[] | undefined;
  searchOption: SalesHistorySearchOption[]; // 검색조건(filter)
  isCancelShow: Bit; // 취소 주문 표시
  isExcludeCouBae: Bit; // 쿠팡/배민 주문 제외
}

// filter options type
const { MAKING, MAKING20, CANCEL } = HISTORY_ORDER_STATE;
const { COUBAE, COUPANG, BAEMIN } = HISTORY_ORDER_TYPE;
const { APP, KIOSK, POS, FPROCESS, NA } = HISTORY_RCP_TYPE;

const useSalesHistoryFilterData = ({ data, searchOption, isCancelShow, isExcludeCouBae }: UseSalesHistoryDataProps) => {
  const [filteredData, setFilteredData] = useState<SalesHistoryData[]>([]); // table data

  // filter (change on select/check)
  useEffect(() => {
    if (data && data.length > 0) {
      const orderType = searchOption[0].value;
      const orderState = searchOption[1].value;
      const rcpType = searchOption[2].value;
      const payType = searchOption[3].value;
      const payWith = searchOption[4].value;
      const giftCert = searchOption[5].value;

      let resultData = data;
      // selectbox
      if (orderType !== 'total' && orderType !== COUBAE) {
        resultData = resultData.filter((dd) => {
          return dd.order_type === Number(orderType);
        });
      } else if (orderType !== 'total' && orderType === COUBAE) {
        resultData = resultData.filter((dd) => {
          return dd.order_type === COUPANG || dd.order_type === BAEMIN;
        });
      }
      if (orderState !== 'total' && Number(orderState) !== MAKING) {
        // total과 제조중(10) 제외한 나머지 state
        resultData = resultData.filter((dd) => {
          return dd.order_state === Number(orderState);
        });
      } else if (orderState !== 'total' && Number(orderState) === MAKING) {
        // 제조중(10)이면 order_state === 10 || 20
        resultData = resultData.filter((dd) => {
          return dd.order_state === MAKING || dd.order_state === MAKING20;
        });
      }
      if (rcpType !== 'total' && rcpType !== NA) {
        resultData = resultData.filter((dd) => {
          return dd.rcp_type === rcpType;
        });
      } else if (rcpType !== 'total' && rcpType === NA) {
        resultData = resultData.filter((dd) => {
          return !(dd.rcp_type === APP || dd.rcp_type === KIOSK || dd.rcp_type === POS || dd.rcp_type === FPROCESS);
        });
      }
      if (payType !== 'total') {
        resultData = resultData.filter((dd) => {
          return dd.pay_type === payType;
        });
      }
      if (payWith !== 'total') {
        resultData = resultData.filter((dd) => {
          return dd.filter_pay_type === payWith;
        });
      }
      if (giftCert !== 'total') {
        resultData = resultData.filter((dd) => {
          return dd.bOrderGiftCert === giftCert;
        });
      }
      // checkbox
      if (isCancelShow === 0) {
        // 취소주문 감출 때 (unchecked)
        resultData = resultData?.filter((dd) => {
          return dd.order_state !== CANCEL;
        });
      }
      if (isExcludeCouBae === 1) {
        // 쿠팡/배민 제외시 (checked)
        resultData = resultData?.filter((dd) => {
          return dd.order_type !== COUPANG && dd.order_type !== BAEMIN;
        });
      }
      setFilteredData(resultData); // update tableData (filtered)
    }
  }, [searchOption, isCancelShow, isExcludeCouBae, data]);

  return { filteredData };
};
export default useSalesHistoryFilterData;
