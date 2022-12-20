import { FC, useState, useRef, useMemo, ReactNode, Suspense, useEffect } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils"; 
import { useQueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { format, subMonths } from "date-fns";

// state
import { franState, loginState } from "state";

// type
import { PageInfoType, OrderDetailDetailProps, SearchInfoSelectType, ETC_ORDER_SEARCH_STATE_TYPE, ETC_ORDER_SEARCH_STATE_LIST } from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component     
import Sticky from "pages/common/sticky";
import EtcDetailTable, { EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";  
import CalanderSearch from "pages/common/calanderSearch";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import OrderDetailExcelBody from './OrderDetailExcelBody';
import EtcDetailTableBottom from "../component/EtcDetailTableBottom";

const OrderDetailDetail: FC<Omit<OrderDetailDetailProps, 'searchInfo'>> = ({ detailTableColGroup, detailTableHead, openOrderDetailModal }) => {
    const { reset } = useQueryErrorResetBoundary(); 
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), // 2022-10
        to: format(new Date(), 'yyyy-MM-dd'), // 2022-11
        searchTrigger: false,
        searchOption: [{title: '상태 전체', value: ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL}]
    }); // etcSearch 내부 검색 날짜

    return (
        <>
            <OrderDetailDetailSearch searchInfo={searchInfo} setSearchInfo={setSearchInfo} />
            <Suspense fallback={<Loading marginTop={120} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                    <OrderDetailDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} openOrderDetailModal={openOrderDetailModal} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

const OrderDetailDetailData: FC<OrderDetailDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo: { from, to, searchOption, searchTrigger}, openOrderDetailModal }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState); 

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 20, // 한 페이지에 나오는 리스트 개수 
    });
    const tableRef = useRef<HTMLTableElement>(null);  
    const thRef = useRef<HTMLTableRowElement>(null);
    const viewportTableRef = useRef<HTMLTableElement>(null);

    // TODO: 데이터  
    // eslint-disable-next-line
    const etcOrderDetailListKey = useMemo(() => ['etc_order_detail_list', JSON.stringify({ franCode, from, to }) ], [ franCode, searchTrigger ]);
    // eslint-disable-next-line
    const etcOrderDetailExcelListKey = useMemo(() => ['etc_order_detail_list_excel', JSON.stringify({ franCode, from, to }) ], [ franCode, searchTrigger ]);
    // table data
    const { data: listData, isSuccess, isError, isLoading, isRefetching, refetch} = ETC_SERVICE.useDetailList(etcOrderDetailListKey, [ franCode, from, to ]);

    // Excel 다운로드용 
    const { data: listExcelData, isSuccess: isExcelSuccess, isError: isExcelError, isLoading: isExcelLoading, isRefetching:isExcelRefetching, refetch: excelRefetch } = ETC_SERVICE.useDetailListExcel(etcOrderDetailExcelListKey, [ franCode, from, to ]);

    useEffect(() => {
        refetch();
        excelRefetch();
    }, [franCode, searchTrigger, refetch, excelRefetch]);

    const [renderTableList, totalSumObj, supplySumObj, vatSumObj]: [ReactNode[] | undefined, number, number, number] = useMemo(() => { 
        const { value: searchOptionValue } = searchOption[0]; // 검색 상태값 (주문 상태)

        let filteredData = listData; // filtering data
        if (searchOptionValue !== ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL) {
            filteredData = listData?.filter((origData: any) => { 
                return origData.state === Number(searchOptionValue)
            })
        }
        
        const tableList = filteredData?.reduce((arr: ReactNode[], tbodyRow, index: number) => {
            const { nOrderID, insert_date, last_modify_date, cancel_date, staff_name, last_modify_staff, cancel_staff, state_name, order_count, first_item, supply_amt, vat_amt, amount } = tbodyRow; 
            
            arr.push(
                <>
                    <td className='align-center'>{insert_date}</td>
                    <td className='align-center'>{last_modify_date}</td>
                    <td className='align-center'>{cancel_date}</td> 
                    <td className='align-center'>{staff_name}</td>
                    <td className='align-center'>{last_modify_staff}</td>
                    <td className='align-center'>{cancel_staff}</td> 
                    <td className='align-center'>{state_name}</td> 
                    <td className='align-right'>{Utils.numberComma(order_count)}</td>
                    <td className='align-left order-view' onClick={() => openOrderDetailModal(nOrderID)}>{order_count > 1 ? `${first_item} 외 ${order_count - 1}건` : first_item}</td>
                    <td className='align-right'>{Utils.numberComma(supply_amt)}원</td>
                    <td className='align-right'>{Utils.numberComma(vat_amt)}원</td>
                    <td className='align-right'>{`${Utils.numberComma(amount)}원`}</td>
                </>
            )

            return arr;
        }, [] as ReactNode[])

        let sumObjTotal = listData?.reduce((acc: any, cur: any) => cur.state !== 50 ? acc += cur.amount : acc, 0) || 0;      // 발주금액 합계
        let sumObjSupply = listData?.reduce((acc: any, cur: any) => cur.state !== 50 ? acc += cur.supply_amt : acc, 0) || 0; // 공급가
        let sumObjVat = listData?.reduce((acc: any, cur: any) => cur.state !== 50 ? acc += cur.vat_amt : acc, 0) || 0;       // 부가세

        return [tableList, sumObjTotal, sumObjSupply, sumObjVat];
    }, [listData, openOrderDetailModal, searchOption]); 

    const orderDetailTablebody = useMemo(() => { 
        const isTableSuccess = isSuccess && isExcelSuccess && !isLoading && !isExcelLoading && !isRefetching && !isExcelRefetching; // 모두 성공 + refetch나 loading 안하고 있을때 
        const isTableLoading = isLoading || isExcelLoading || isRefetching || isExcelRefetching; // 처음으로 요청 || refetch 하는 경우 
        const isTableError = isError || isExcelError; // 모두 실패한 경우 

        if( isTableSuccess ) {
            return <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
        } else if( isTableError ) {
            return <tbody><SuspenseErrorPage isTable={true} /></tbody>
        } else if( isTableLoading ){
            return <tbody><Loading isTable={true} /></tbody>
        } 
    }, [isSuccess, isExcelSuccess, isLoading, isExcelLoading, isRefetching, isExcelRefetching, isError, isExcelError, pageInfo, renderTableList]);

    // TODO: 엑셀, 페이지네이션 관련
    const excelTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '120', '80', '120', '110', '150'];
    const excelTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '품목 상세' }, { itemName: '단가' },{ itemName: '수량' }, { itemName: '공급가' }, { itemName: '부가세' }, { itemName: '발주 금액' }]
    ]
    const handleExcelDownload = () => {
        const branchName = f_list.filter((el) => el.f_code === franCode)[0].f_code_name;
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: excelTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_발주내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 

    return (
        <> 
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {from} ~ {to}</p>
                </div>
                <ul className="search-result">
                    <li className="hyphen">총 발주금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(totalSumObj)}원</span></li>
                    <li className="hyphen">총 발주금액 공급가<span className="colon"></span><span className="value">{Utils.numberComma(supplySumObj)}원</span></li>
                    <li className="hyphen">총 발주금액 부가세<span className="colon"></span><span className="value">{Utils.numberComma(vatSumObj)}원</span></li>
                </ul>
            </div>

            <Sticky reference={thRef.current} contentsRef={viewportTableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={viewportTableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/>  
                {orderDetailTablebody}
            </table>

            {isSuccess && isExcelSuccess && (
                <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef} style={{display: 'none'}}> 
                    <EtcDetailTableHead detailTableColGroup={excelTableColGroup} detailTableHead={excelTableHead} /> 
                    <OrderDetailExcelBody data={listExcelData} searchOptionValue={searchOption[0].value} />
                </table>
            )} 
            
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}

export default OrderDetailDetail;

const OrderDetailDetailSearch: FC<{searchInfo:SearchInfoSelectType, setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoSelectType>> }> = ({ searchInfo, setSearchInfo }) => {
    const handleRefetch = () => {
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger }));
    };

    const searchOptionList = [
        {
            [ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL]: {title: '상태 전체', value: ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL},
            [ETC_ORDER_SEARCH_STATE_TYPE.AWAIT]: {title: '대기', value: 0},
            [ETC_ORDER_SEARCH_STATE_TYPE.CONFIRM]: {title: '발주확인', value: 10},
            [ETC_ORDER_SEARCH_STATE_TYPE.PACKING]: {title: '패킹완료', value: 20},
            [ETC_ORDER_SEARCH_STATE_TYPE.DELIVERY]: {title: '배송출발', value: 30},
            [ETC_ORDER_SEARCH_STATE_TYPE.PARTIAL_COMPLETE]: {title: '일부배달완료', value: 35},
            [ETC_ORDER_SEARCH_STATE_TYPE.COMPLETE]: {title: '배송완료', value: 40},
            [ETC_ORDER_SEARCH_STATE_TYPE.CANCEL]: {title: '취소', value: 50}
        }
    ]
    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            selectOption={searchOptionList}
            optionList={ETC_ORDER_SEARCH_STATE_LIST}
            handleSearch={handleRefetch} // 조회 버튼에 필요한 fn
        />
    )
}