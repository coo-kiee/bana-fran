import React, { FC, useState, useRef, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState } from "state";

// type
import { EtcListParams, PageInfoType, SearchInfoType, OrderDetailDetailProps } from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component 
import { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const OrderDetailDetail: FC<OrderDetailDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), // 2022-10-18
        to: format(new Date(), 'yyyy-MM-dd') // 2022-11-18
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 

    return (
        <>
            <OrderDetailDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* *_list 프로시저 사용하는 컴포넌트 */}
                    <OrderDetailDetailData
                        searchInfo={searchInfo}
                        detailTableColGroup={detailTableColGroup}
                        detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default OrderDetailDetail;

const OrderDetailDetailData: FC<Omit<OrderDetailDetailProps, 'handleSearchInfo'>> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // 프로시저 
    let detailTableBody: (string | number)[][] = [];
    let detailSearchResult: any = [];
    const etcOrderDetailListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData, isSuccess: etcMusicListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('JNXWSFKFWJJD8DRH9OEU', etcOrderDetailListParam, 'etc_order_detail_list'); /*useOrderDetailList(etcOrderDetailListParam);*/

    if (etcMusicListSuccess) {
        detailTableBody = listData;
        detailSearchResult = [
            ['총 발주금액 합계: ', Utils.numberComma(listData.reduce((acc: any, cur: any) => acc += cur.amount, 0))]
        ];
    }

    // 엑셀 다운로드 관련 
    const tableRef = useRef<null | HTMLTableElement>(null);
    const handleExcelPrint = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: `${searchInfo.from}~${searchInfo.to}`, // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };

            try {
                Utils.excelDownload(tableRef.current, options, '발주내역');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            {/* 조회 기간 -> total 프로시저 관련 */}
            <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} />

            {/* 게시판 -> list 프로시저 관련 */}
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} ref={tableRef} />

            {/* 엑셀다운, 페이징, 정렬  -> list 프로시저 관련 */}
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
}

const OrderDetailDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), // 2022-10-18
        to: format(new Date(), 'yyyy-MM-dd') // 2022-11-18
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
        />
    )
}