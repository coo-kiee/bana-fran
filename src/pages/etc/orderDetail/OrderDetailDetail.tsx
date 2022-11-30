import { FC, useState, useRef, useMemo, ReactNode, Suspense } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Utils from "utils/Utils"; 
import { useQueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";

// state
import { franState, loginState, orderDetailModalState } from "state";

// type
import { EtcListParams, PageInfoType, OrderDetailDetailProps } from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component    
import Pagination from "pages/common/pagination";
import Sticky from "pages/common/sticky";
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";  
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage"; 

const OrderDetailDetail: FC<OrderDetailDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const { reset } = useQueryErrorResetBoundary(); 

    return (
        <Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                <OrderDetailDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </ErrorBoundary>
        </Suspense>
    )
}

const OrderDetailDetailData: FC<OrderDetailDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);
    const setOrderDetailmodalState = useSetRecoilState(orderDetailModalState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    });
    const tableRef = useRef<HTMLTableElement>(null);  
    const thRef = useRef<HTMLTableRowElement>(null);

    // TODO: 데이터  
    const etcOrderDetailListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to }; 
    const { data: listData, isSuccess, isError, isLoading } = ETC_SERVICE.useDetailList(etcOrderDetailListParam); 

    const [renderTableList, totalSumObj]: [ReactNode[] | undefined, number] = useMemo(() => { 
        const handlePopupOrderDetail = (nOrderID: number) => { 
            setOrderDetailmodalState((prevState) => ({ ...prevState, show: true, orderCode: nOrderID }));
        };

        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow, index: number) => {
            const { nOrderID, insert_date, last_modify_date, cancel_date, staff_name, last_modify_staff, cacel_staff, state_name, order_count, first_item, amount } = tbodyRow; 

            arr.push(
                <>
                    <td className='align-center'>{insert_date}</td>
                    <td className='align-center'>{last_modify_date}</td>
                    <td className='align-center'>{cancel_date}</td> 
                    <td className='align-center'>{staff_name}</td>
                    <td className='align-center'>{last_modify_staff}</td>
                    <td className='align-center'>{cacel_staff}</td> 
                    <td className='align-center'>{state_name}</td> 
                    <td className='align-right'>{Utils.numberComma(order_count)}</td>
                    <td className='align-left order-view' onClick={() => handlePopupOrderDetail(nOrderID)}>{order_count > 1 ? `${first_item} 외 ${order_count - 1}건` : first_item}</td>
                    <td className='align-right'>{`${Utils.numberComma(amount)}원`}</td>
                </>
            )

            return arr;
        }, [] as ReactNode[])

        let sumObj = listData?.reduce((acc: any, cur: any) => acc += cur.amount, 0) || 0; 

        return [tableList, sumObj];
    }, [listData, setOrderDetailmodalState]); 

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_발주내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };
    const handlePageChange = (changePage: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, currentPage: changePage }))
    }
    const handlePageRow = (row: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, row: row }))
    }

    return (
        <> 
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
                <ul className="search-result">
                    <li className="hyphen">총 발주금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(totalSumObj)}원</span></li>
                </ul>
            </div>

            <Sticky reference={thRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/> 
                {isSuccess && <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> }
                {isLoading && <tbody><Loading isTable={true} /></tbody>}
                {isError && <tbody><SuspenseErrorPage isTable={true} /></tbody>} 
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={!!renderTableList ? renderTableList.length : 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
}

export default OrderDetailDetail;