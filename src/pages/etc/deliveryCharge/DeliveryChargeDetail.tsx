import React, { FC, useState, useRef, useMemo, ReactNode, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Utils from "utils/Utils";
import { format } from "date-fns";

// state
import { franState, loginState } from "state";

// type
import { EtcListParams, PageInfoType, DeliveryChargeDetailProps, ETC_DELIVERY_SEARCH_OPTION_TYPE, DeliveryDetailListType } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component   
import  { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";  
import Pagination from "pages/common/pagination"; 
import Sticky from "pages/common/sticky";  

const DeliveryChargeDetail: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                <DeliveryChargeDetailData
                    searchInfo={searchInfo}
                    handleSearchInfo={handleSearchInfo}
                    detailTableColGroup={detailTableColGroup}
                    detailTableHead={detailTableHead}
                />
            </ErrorBoundary>
        </React.Suspense>
    )
}

export default DeliveryChargeDetail; 

const DeliveryChargeDetailData: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 

    // TODO: 프로시저   
    const etcDeliveryListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData, isSuccess, isLoading, isError } = ETC_SERVICE.useEtcList<EtcListParams, DeliveryDetailListType[]>('YOCYKBCBC6MTUH9AXBM7', etcDeliveryListParam, 'etc_delivery_list');

    // TODO: 프로시저 관련 변수 
    const [renderTableList, totalCharge, supplyTotal, taxTotal]: [ReactNode[], number, number, number] = useMemo(() => {
        const tableList = listData?.reduce((arr: any, tbodyRow, index: number) => {
            const { delivery_pay_type, dtRcp, nDeliveryCharge, payment_type, sItem, sPhone, suply_fee, suply_fee_tax, total_charge, total_fee} = tbodyRow;

            // option filter
            const paymentType = searchInfo.searchOption[0].value === ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL ? true : searchInfo.searchOption[0].title === delivery_pay_type;

            if(paymentType){
                arr.push(
                    <>
                        <td className="align-center">{format(new Date(dtRcp), `yyyy-MM-dd hh:mm`)}</td>
                        <td className="align-left">{sItem}</td>
                        <td className="align-right">{Utils.numberComma(total_charge)}</td>
                        <td className="align-right">{Utils.numberComma(nDeliveryCharge)}</td>
                        <td className="align-center">{payment_type}</td>
                        <td className="align-center">{delivery_pay_type}</td>
                        <td className="align-center">{Utils.phoneNumberEncryption(sPhone)}</td>
                        <td className="align-right">{Utils.numberComma(suply_fee)}</td>
                        <td className="align-right">{Utils.numberComma(suply_fee_tax)}</td>
                        <td className="align-right"><strong>{Utils.numberComma(total_fee)}</strong></td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        const totalCharge = listData?.reduce((acc: any, cur: any) => acc += cur.total_charge, 0) || 0; // 바나 딜리버리 주문금액 합계
        const supplyTotal = listData?.reduce((acc: any, cur: any) => acc += cur.suply_fee, 0) || 0; // 바나 딜리버스 수수료 공급가(주문금액*2%) 합계
        const taxTotal = listData?.reduce((acc: any, cur: any) => acc += (cur.suply_fee + cur.suply_fee_tax), 0) || 0; // 바나 딜리버리 수수료(수수료 공급가+부가세) 합계

        return [tableList, totalCharge, supplyTotal, taxTotal];
    }, [listData, searchInfo.searchOption])

    // 엑셀 다운로드, 페이지 이동 관련
    const handleExcelDownload = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_딜리버리수수료내역`;
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
                    <li className="hyphen">바나 딜리버리 주문금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(totalCharge)}원</span></li>
                    <li className="hyphen">바나 딜리버스 수수료 공급가(주문금액*2%) 합계<span className="colon"></span><span className="value">{Utils.numberComma(supplyTotal)}원</span></li>
                    <li className="hyphen">바나 딜리버리 수수료(수수료 공급가+부가세) 합계<span className="colon"></span><span className="value">{Utils.numberComma(taxTotal)}원</span></li>
                </ul>
                <div className="price-info">
                    <p className="hyphen"><span>주문금액</span><span className="colon"></span>배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.</p>
                    <p className="hyphen"><span>수수료 공급가</span><span className="colon"></span>주문금액의 2% (부가세 별도.)</p>
                </div>
            </div>

            <Sticky reference={thRef.current}> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/>
            </Sticky>
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> 
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={renderTableList.length || 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
}

