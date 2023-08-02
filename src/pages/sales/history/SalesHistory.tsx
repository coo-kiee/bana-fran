import { useEffect } from "react";
import { useRecoilValue } from "recoil";
// global state
import { franState } from "state";

// API
import SALES_SERVICE from 'service/salesService';
// Types
import { SalesHistoryProps, HISTORY_ORDER_TYPE, HISTORY_ORDER_STATE, HISTORY_RCP_TYPE } from "types/sales/salesType";
// Components
import DataLoader from "pages/common/dataLoader";
import NoData from "pages/common/noData";
import TableRow from "./table/TableRow";


// filter options type
const { MAKING, MAKING20, CANCEL } = HISTORY_ORDER_STATE;
const { COUBAE, COUPANG, BAEMIN } = HISTORY_ORDER_TYPE;
const { APP, KIOSK, POS, FPROCESS, NA } = HISTORY_RCP_TYPE;

const SalesHistory = ({ queryTrigger, historySearch, isCancelShow, isExcludeCouBae, tableData, setTableData, setTotalData, currentPage, rowPerPage}: SalesHistoryProps) => {
    // global state
	const fCode = useRecoilValue(franState);
    
	// query
	const { data, isSuccess } = SALES_SERVICE.useSalesOrderList({ from_date: historySearch.from, to_date: historySearch.to, f_code: fCode }, queryTrigger);

	// filter (change on select/check)
    useEffect(() => {
        if(isSuccess) {
            setTotalData(data); // 초기 데이터 저장 (prefixSum에 사용, filter X)
            const orderType = historySearch.searchOption[0].value;
            const orderState = historySearch.searchOption[1].value;
            const rcpType = historySearch.searchOption[2].value;
            const payType = historySearch.searchOption[3].value;
            const payWith = historySearch.searchOption[4].value;
            const giftCert = historySearch.searchOption[5].value;
            
            let resultData = data;
            // selectbox
            if (orderType !== 'total' && orderType !== COUBAE) { 
                resultData = resultData.filter((dd) => {return dd.order_type === Number(orderType)});
            } else if (orderType !== 'total' && orderType === COUBAE) { 
                resultData = resultData.filter((dd) => {return dd.order_type === COUPANG || dd.order_type === BAEMIN});
            }
            if (orderState !== 'total' && Number(orderState) !== MAKING) {
                // total과 제조중(10) 제외한 나머지 state			
                resultData = resultData.filter((dd) => {return dd.order_state === Number(orderState)});
            } else if (orderState !== 'total' && Number(orderState) === MAKING) { 
                // 제조중(10)이면 order_state === 10 || 20
                resultData = resultData.filter((dd) => {return dd.order_state === MAKING || dd.order_state === MAKING20});
            }
            if (rcpType !== 'total' && rcpType !== NA) {
                resultData = resultData.filter((dd) => {return dd.rcp_type === rcpType});
            } else if (rcpType !== 'total' && rcpType === NA) {
                resultData = resultData.filter((dd) => {
                    return !(dd.rcp_type === APP || dd.rcp_type === KIOSK || dd.rcp_type === POS || dd.rcp_type === FPROCESS);
                });
            }
            if (payType !== 'total') {
                resultData = resultData.filter((dd) => {return dd.pay_type === payType});
            }
            if (payWith !== 'total') {
                resultData = resultData.filter((dd) => { if(dd.filter_pay_type === '카카오') {console.log(payWith)} return dd.filter_pay_type === payWith});
            }
            if (giftCert !== 'total') {
                resultData = resultData.filter((dd) => {return dd.bOrderGiftCert === giftCert});
            }
            // checkbox
            if (isCancelShow === 0) { // 취소주문 감출 때 (unchecked)
                resultData = resultData?.filter((dd) => {return dd.order_state !== CANCEL});
            }
            if (isExcludeCouBae === 1) { // 쿠팡/배민 제외시 (checked)
                resultData = resultData?.filter((dd) => {return dd.order_type !== COUPANG && dd.order_type !== BAEMIN});
            }
            setTableData(resultData); // update tableData (filtered)
        }
    }, [data, isSuccess, historySearch.searchOption, isCancelShow, isExcludeCouBae, setTableData, setTotalData])

	return (
        <DataLoader
            isData={data && data.length > 0}
            noData={<NoData isTable={true} rowSpan={1} colSpan={28} paddingTop={20} paddingBottom={20} />}>
            {tableData.map((data, idx) => {
                // pagination
                const isDisplay = (currentPage - 1) * rowPerPage <= idx && currentPage * rowPerPage > idx;
                return isDisplay ? <TableRow data={data} key={`history_row_${idx}`} /> : null;
            })}
        </DataLoader>
	);
}

export default SalesHistory;