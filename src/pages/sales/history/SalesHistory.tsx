import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { franState } from "state";

// API
import SALES_SERVICE from 'service/salesService';
// Types
import { SalesHistoryProps, HISTORY_ORDER_TYPE, HISTORY_ORDER_STATE, HISTORY_RCP_TYPE } from "types/sales/salesType";

// Components
import TableBody from "./table/TableBody";

const SalesHistory = ({ queryKey, historySearch, isCancelShow, isExcludeCouBae, historyData, setHistoryData, currentPage, rowPerPage}: SalesHistoryProps) => {
	// global states
	const fCode = useRecoilValue(franState); // franCode
	// query
	const { data, isSuccess } = SALES_SERVICE.useSalesOrderList({ from_date: historySearch.from, to_date: historySearch.to, f_code: fCode }, queryKey);

	// filter (change on select/check): order_type, order_state, rcp_type, pay_type, gift_cert, isCancelShow, isExcludeCouBae
    useEffect(() => {
        if(isSuccess) {
            const orderType = historySearch.searchOption[0].value; 		// 주문유형 1: 앱 2,3:쿠팡/배민 else: 매장
            const orderState = historySearch.searchOption[1].value;		// 주문상태
            const rcpType = historySearch.searchOption[2].value;		// 접수타입
            const payType = historySearch.searchOption[3].value;		// 결제방식 
            const giftCert = historySearch.searchOption[4].value;		// 0: 일반결제, 1: 상품권
            
            let resultData = data;
            // selectbox
            if (orderType !== 'total' && orderType !== HISTORY_ORDER_TYPE.COUBAE) { 
                resultData = resultData.filter((dd: any) => {return dd.order_type === Number(orderType)});
            } else if (orderType !== 'total' && orderType === HISTORY_ORDER_TYPE.COUBAE) { 
                resultData = resultData.filter((dd: any) => {return dd.order_type === 2 || dd.order_type === 3});
            }
            if (orderState !== 'total' && orderState !== HISTORY_ORDER_STATE.MAKING) { // 주문상태
                // total과 제조중(10) 제외한 나머지 state			
                resultData = resultData.filter((dd: any) => {return dd.order_state === Number(orderState)});
            } else if (orderState !== 'total' && orderState === HISTORY_ORDER_STATE.MAKING) { 
                // 제조중(10)이면 order_state === 10 || 20
                resultData = resultData.filter((dd: any) => {return dd.order_state === 10 || dd.order_state === 20});
            }
            if (rcpType !== 'total' && rcpType !== HISTORY_RCP_TYPE.NA) {
                resultData = resultData.filter((dd: any) => {return dd.rcp_type === rcpType});
            } else if (rcpType !== 'total' && rcpType === HISTORY_RCP_TYPE.NA) {
                resultData = resultData.filter((dd: any) => {
                    return !(dd.rcp_type === '앱' || dd.rcp_type === '키오스크' || dd.rcp_type === '직접결제POS' || dd.rcp_type === '매장앱')
                });
            }
            if (payType !== 'total') {
                resultData = resultData.filter((dd: any) => {return dd.pay_type === payType});
            }
            if (giftCert !== 'total') {
                resultData = resultData.filter((dd: any) => {return dd.bOrderGiftCert === giftCert});
            }
            // checkbox
            if (isCancelShow === 0) { // 취소주문 감출 때 (unchecked)
                resultData = resultData?.filter((dd: any) => {return dd.order_state !== 50});
            }
            if (isExcludeCouBae === 1) { // 쿠팡/배민 제외시 (checked)
                resultData = resultData?.filter((dd: any) => {return dd.order_type !== 2 && dd.order_type !== 3});
            }
            setHistoryData(resultData); // update historyData (filtered)
        }
    }, [data, isSuccess, historySearch.searchOption, isCancelShow, isExcludeCouBae, setHistoryData])

	return <TableBody data={historyData || data} rowPerPage={rowPerPage} currentPage={currentPage} />;
}

export default SalesHistory;