import { useEffect } from "react";
import { useRecoilValue } from "recoil";
// global state
import { franState } from "state";

// API
import SALES_SERVICE from 'service/salesService';
// Types
import { SalesHistoryProps, HISTORY_ORDER_TYPE, HISTORY_ORDER_STATE, HISTORY_RCP_TYPE } from "types/sales/salesType";
// Components
import TableDetail from "./table/TableDetail";
import NoData from "pages/common/noData";

const SalesHistory = ({ queryTrigger, historySearch, isCancelShow, isExcludeCouBae, tableData, setTableData, setTotalData, currentPage, rowPerPage}: SalesHistoryProps) => {
	// global state
	const fCode = useRecoilValue(franState);
	// query
	const { data, isSuccess } = SALES_SERVICE.useSalesOrderList({ from_date: historySearch.from, to_date: historySearch.to, f_code: fCode }, queryTrigger);

	// filter (change on select/check)
    useEffect(() => {
        if(isSuccess) {
            setTotalData(data); // 초기 데이터 저장 (prefixSum에 사용, filter 적용 X)
            const orderType = historySearch.searchOption[0].value; 		// 주문유형 1: 앱 2,3:쿠팡/배민 else: 매장
            const orderState = historySearch.searchOption[1].value;		// 주문상태
            const rcpType = historySearch.searchOption[2].value;		// 접수타입
            const payType = historySearch.searchOption[3].value;		// 결제방식 
            const giftCert = historySearch.searchOption[4].value;		// 0: 일반결제, 1: 상품권
            
            let resultData = data;
            // selectbox
            if (orderType !== 'total' && orderType !== HISTORY_ORDER_TYPE.COUBAE) { 
                resultData = resultData.filter((dd) => {return dd.order_type === Number(orderType)});
            } else if (orderType !== 'total' && orderType === HISTORY_ORDER_TYPE.COUBAE) { 
                resultData = resultData.filter((dd) => {return dd.order_type === 2 || dd.order_type === 3});
            }
            if (orderState !== 'total' && orderState !== HISTORY_ORDER_STATE.MAKING) {
                // total과 제조중(10) 제외한 나머지 state			
                resultData = resultData.filter((dd) => {return dd.order_state === Number(orderState)});
            } else if (orderState !== 'total' && orderState === HISTORY_ORDER_STATE.MAKING) { 
                // 제조중(10)이면 order_state === 10 || 20
                resultData = resultData.filter((dd) => {return dd.order_state === 10 || dd.order_state === 20});
            }
            if (rcpType !== 'total' && rcpType !== HISTORY_RCP_TYPE.NA) {
                resultData = resultData.filter((dd) => {return dd.rcp_type === rcpType});
            } else if (rcpType !== 'total' && rcpType === HISTORY_RCP_TYPE.NA) {
                resultData = resultData.filter((dd) => {
                    return !(dd.rcp_type === '앱' || dd.rcp_type === '키오스크' || dd.rcp_type === '직접결제POS' || dd.rcp_type === '매장앱')
                });
            }
            if (payType !== 'total') {
                resultData = resultData.filter((dd) => {return dd.pay_type === payType});
            }
            if (giftCert !== 'total') {
                resultData = resultData.filter((dd) => {return dd.bOrderGiftCert === giftCert});
            }
            // checkbox
            if (isCancelShow === 0) { // 취소주문 감출 때 (unchecked)
                resultData = resultData?.filter((dd) => {return dd.order_state !== 50});
            }
            if (isExcludeCouBae === 1) { // 쿠팡/배민 제외시 (checked)
                resultData = resultData?.filter((dd) => {return dd.order_type !== 2 && dd.order_type !== 3});
            }
            setTableData(resultData); // update tableData (filtered)
        }
    }, [data, isSuccess, historySearch.searchOption, isCancelShow, isExcludeCouBae, setTableData, setTotalData])

	return (
        data && data?.length > 0 ? 
        <TableDetail data={tableData} rowPerPage={rowPerPage} currentPage={currentPage} /> : 
        <NoData isTable={true} rowSpan={1} colSpan={25} paddingTop={20} paddingBottom={20} />
    );
}

export default SalesHistory;