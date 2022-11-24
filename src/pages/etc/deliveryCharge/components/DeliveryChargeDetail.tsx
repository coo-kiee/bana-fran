import React, { FC, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { useQueryErrorResetBoundary, useQueryClient } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { EtcListParams, PageInfoType, DeliveryChargeDetailProps, SearchInfoSelectType, ETC_DELIVERY_SEARCH_OPTION_TYPE, ETC_DELIVERY_SEARCH_OPTION_LIST, SearchInfoType } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component  
import CalanderSearch from "pages/common/calanderSearch";
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import { EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const DeliveryChargeDetail: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo, detailPriceInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <DeliveryChargeDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* *_list 프로시저 사용하는 컴포넌트 */}
                    <DeliveryChargeDetailData
                        searchInfo={searchInfo}
                        detailPriceInfo={detailPriceInfo}
                        handleSearchInfo={handleSearchInfo}
                        detailTableColGroup={detailTableColGroup}
                        detailTableHead={detailTableHead}
                    />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default DeliveryChargeDetail;

const DeliveryChargeDetailData: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, detailPriceInfo }) => {
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const tableRef = useRef<HTMLTableElement>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const [isSearching, setIsSearching] = useState(false);

    // TODO: 프로시저  
    let detailTableBody = []; // EtcDetailTable 내부 데이터
    const etcDeliveryListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData, isSuccess: etcDeliveryListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('YOCYKBCBC6MTUH9AXBM7', etcDeliveryListParam, 'etc_delivery_list');

    // TODO: 프로시저 성공 후 업데이트 (=날짜 변경 O인 경우)
    if (etcDeliveryListSuccess) {
        // 날짜 변경하여 검색하는데 옵션이 있는 경우
        const filter = searchInfo.searchOption.map((option) => option.value)
        detailTableBody = listData; // ! detailTableBody = listData.filter(...) 처리 후 담아주기
    };

    // TODO: 프로시저 관련 변수
    // 이후 테스트 데이터 보고 타입 지정 + 수정
    let detailSearchResultTest = useMemo(() => {
        const data: any = queryClient.getQueryData(['etc_delivery_total', franCode]);

        return [
            ['바나 딜리버리 주문금액 합계', `${data.suply_fee}`],
            ['바나 딜리버스 수수료 공급가(주문금액*2%) 합계', `${data.suply_fee_tax}`],
            ['바나 딜리버리 수수료(수수료 공급가+부가세) 합계', `${data.total_fee}`]
        ];
    }, [queryClient, franCode]); // EtcSearchDetail 내부 데이터

    // TODO: 날짜 변경 X, 옵션만 변경하는 경우
    useEffect(() => {
        setIsSearching(true);
        console.log(`searchOption.type 변경되었다면 실행`)
        // const data: any = queryClient.getQueryData([`etc_delivery_list`, searchInfo.from, searchInfo.to, franCode]);
        // detailTableBody = data.filter((el) => el.payment === '현장카드');
        setIsSearching(false);
    }, [searchInfo.searchOption])

    return (
        <>
            {isSearching ?
                <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} />
                :
                <>
                    <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResultTest} priceInfo={detailPriceInfo} />
                    <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />
                </>
            }

            {/* 엑셀다운, 페이징, 정렬  -> list 프로시저 관련 */}
            <EtcDetailFooter
                dataCnt={detailTableBody.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`딜리버리수수료내역`}
            />
        </>
    )
}

const DeliveryChargeDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'), // 2022-10-01
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'), // 2022-10-31
        searchOption: [{ value: 'SEARCH_0', title: '구분 전체' }],
    }); // etcSearch 내부 검색 날짜 관련 보여질 state

    const searchOptionList = [
        {
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL]: { title: '구분 전체', value: 'TOTAL' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD]: { title: '현장카드', value: 'CARD' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH]: { title: '현장현금', value: 'CASH' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.APP]: { title: '어플선결제', value: 'APP' },
        }
    ];

    return (
        // 검색 -> 관련 X 
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            selectOption={searchOptionList}
            optionList={ETC_DELIVERY_SEARCH_OPTION_LIST}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
        />
    )
}
