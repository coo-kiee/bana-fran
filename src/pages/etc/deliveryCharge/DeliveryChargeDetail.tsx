import React, { FC, useState, useRef, useMemo, ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { useQueryErrorResetBoundary, useQueryClient } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { EtcListParams, PageInfoType, DeliveryChargeDetailProps, ETC_DELIVERY_SEARCH_OPTION_TYPE, } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component   
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import { EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";
import Pagination from "pages/common/pagination";
import Utils from "utils/Utils";
import NoData from "pages/common/noData";

const DeliveryChargeDetail: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo, detailPriceInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                <DeliveryChargeDetailData
                    searchInfo={searchInfo}
                    detailPriceInfo={detailPriceInfo}
                    handleSearchInfo={handleSearchInfo}
                    detailTableColGroup={detailTableColGroup}
                    detailTableHead={detailTableHead}
                />
            </ErrorBoundary>
        </React.Suspense>
    )
}

export default DeliveryChargeDetail;

const DeliveryChargeDetailData: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, detailPriceInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const tableRef = useRef<HTMLTableElement>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 

    // TODO: 프로시저   
    const etcDeliveryListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData } = ETC_SERVICE.useEtcList<EtcListParams>('YOCYKBCBC6MTUH9AXBM7', etcDeliveryListParam, 'etc_delivery_list');

    // TODO: 프로시저 관련 변수 
    const [renderTableList, totalSumObj]: [ReactNode[], string[][]] = useMemo(() => {
        const tableList = listData?.reduce((arr: any, tbodyRow: any, index: number) => {
            const isCardType = searchInfo.searchOption[0].value === ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD;
            const isCashType = searchInfo.searchOption[0].value === ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH;
            const isAppType = searchInfo.searchOption[0].value === ETC_DELIVERY_SEARCH_OPTION_TYPE.APP;

            if (isCardType && isCashType && isAppType) {
                arr.push(
                    <>
                        <td className="align-center">22/06/01~22/06/30</td>
                        <td className="align-left">아메리카노 외 1건</td>
                        <td className="align-right">5,000</td>
                        <td className="align-right">2,900</td>
                        <td className="align-center">현장카드</td>
                        <td className="align-center">카드, 바나포인트</td>
                        <td className="align-center">0101234****</td>
                        <td className="align-right">130,000</td>
                        <td className="align-right">130,000</td>
                        <td className="align-right"><strong>130,000</strong></td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        const sumObj = [
            ['바나 딜리버리 주문금액 합계', `0`],
            ['바나 딜리버스 수수료 공급가(주문금액*2%) 합계', `0`],
            ['바나 딜리버리 수수료(수수료 공급가+부가세) 합계', `0`]
        ];
        return [tableList, sumObj];
    }, [listData])

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
            {/* <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={totalSumObj} priceInfo={detailPriceInfo} /> */}
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
                <ul className="search-result">
                    {totalSumObj.map((result, idx) => {
                        const [title, value] = result;
                        return <li key={`etc_search_detail_result_${idx}`} className="hyphen">{title}<span className="colon"></span><span className="value">{value}원</span></li>
                    })}
                </ul>
                <div className="price-info">
                    <p className="hyphen"><span>주문금액</span><span className="colon"></span>배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.</p>
                    <p className="hyphen"><span>수수료 공급가</span><span className="colon"></span>주문금액의 2% (부가세 별도.)</p>
                </div>
            </div>

            {/* <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={renderTableList} pageInfo={pageInfo} /> */}
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <colgroup>
                    {detailTableColGroup.map((el, idx) => <col key={`extra_overall_col_${idx}`} width={el} />)}
                </colgroup>
                <thead>
                    {detailTableHead.map((trData, idx1) => {
                        return (
                            <tr key={`extra_overall_table_row_${idx1}`} >
                                {trData.map((tdData, idx2) => {
                                    return (
                                        <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                            {tdData.itemName}
                                        </th>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </thead>

                <tbody>
                    {renderTableList.map((item: any, index: number) => {
                        const isCurrentPage = (index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row);
                        return (<tr key={index} style={{ display: isCurrentPage ? '' : 'none' }}>{item}</tr>);
                    })}
                    {renderTableList.length === 0 && <NoData isTable={true} />}
                </tbody>
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={renderTableList.length} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>

            {/* 엑셀다운, 페이징, 정렬  -> list 프로시저 관련 */}
            {/* <EtcDetailFooter
                dataCnt={renderTableList.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`딜리버리수수료내역`}
            /> */}
        </>
    )
}

