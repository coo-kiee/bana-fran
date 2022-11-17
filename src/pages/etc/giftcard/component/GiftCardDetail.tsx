import React, { FC, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState } from "state";

// type
import {
    EtcListParams, PageInfoType, GiftcardDetailProps, SearchInfoSelectType,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_LIST,
} from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component 
import { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const GiftCardDetail: FC<GiftcardDetailProps> = ({ detailPriceInfo, detailTableHead, detailTableColGroup, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [
            { value: 'CATEGORY_ALL', title: '포인트 구분 전체' },
            { value: 'CARD_ALL', title: '상품권종 전체' },
            { value: 'DEVICE_ALL', title: '처리기기 전체' },
        ],
    }); // etcSearch 내부 검색 날짜 관련 보여질 state

    const searchOptionList = [
        {
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL]: { title: '포인트 구분 전체', value: 'CATEGORY_ALL' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL]: { title: '판매', value: 'SELL' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL_DELETE]: { title: '판매 취소(폐기)', value: 'SELL_DELETE' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ADD]: { title: '임의 추가', value: 'ADD' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.DELETE]: { title: '임의 폐기', value: 'DELETE' },
        },
        {
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL]: { title: '상품권종 전체', value: 'CARD_ALL' },
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.TEN]: { title: '1만원권', value: 'TEN' },
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.THIRTY]: { title: '3만원권', value: 'THIRTY' },
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.FIFTY]: { title: '5만원권', value: 'FIFTY' },
        },
        {
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL]: { title: '처리기기 전체', value: 'DEVICE_ALL' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.BRANCH_APP]: { title: '매장 앱', value: 'BRANCH_APP' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.APP]: { title: '어플', value: 'APP' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.KIOSK]: { title: '키오스크', value: 'DEVICE_2' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.POS]: { title: 'POS', value: 'DEVICE_2' },
        },
    ];

    return (
        <>
            {/* 검색 -> 관련 X */}
            <CalanderSearch
                title={`상세내역`}
                dateType={'yyyy-MM-dd'}
                searchInfo={tempSearchInfo}
                setSearchInfo={setTempSearchInfo}
                selectOption={searchOptionList}
                optionList={[ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_LIST]}
                handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            />

            <React.Suspense fallback={<EtcDetailTableFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* *_list 프로시저 사용하는 컴포넌트 */}
                    <GiftCardDetailData
                        searchInfo={searchInfo}
                        detailPriceInfo={detailPriceInfo}
                        handleSearchInfo={handleSearchInfo}
                        detailTableColGroup={detailTableColGroup}
                        detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

const GiftCardDetailData: FC<GiftcardDetailProps> = ({ detailPriceInfo, detailTableHead, detailTableColGroup, searchInfo, handleSearchInfo }) => {
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // 상태 
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const [isSearching, setIsSearching] = useState(false);

    // .board-wrap table 관련 (가장 하단 테이블)
    // TODO: 이후에 테스트 데이터 보고 타입 지정 + 수정
    // ['22/06/01~22/06/30', '아메리카노 외 1건', '1,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'], 
    let detailTableBody: any[] = [
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '+10,000', '', '', '1장 (50,000)'],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '-10,000', '1장 (10,000)', '1장 (10,000)', ''],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '+10,000', '', '', '1장 (50,000)'],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '-10,000', '1장 (10,000)', '1장 (10,000)', ''],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '+10,000', '', '', '1장 (50,000)'],
        ['2022/12/31 12:30', '판매취소(폐기)', '3만원', '1장 (30,000)', '어플', '-10,000', '1장 (10,000)', '1장 (10,000)', ''],
    ];

    // 프로시저
    const etcGiftcardListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    // !! 다른 페이지 프로시저 -> 나오면 고치기
    const { data: listData, isSuccess: etcGiftcardListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('VK4WML6GW9077BKEWP3O', etcGiftcardListParam, 'etc_giftcard_list');

    if (etcGiftcardListSuccess) {
        // console.log(`etcGiftcardList: `, listData)
        detailTableBody = listData
    }

    let detailSearchResultTest = [
        ['발주금액 합계', '10,000'],
        ['키오스크/POS 판매금액 합계', '10,000'],
        ['어플 판매금액 합계', '10,000'],
        ['판매취소(폐기)금액 합계', '10,000'],
    ];
    // let detailSearchResultTest = useCallback(() => {
    //     const data: any = queryClient.getQueryData(['etc_giftcard_statistic', franCode]);

    //     return [
    //        ['발주금액 합계', '10,000'],
    //        ['키오스크/POS 판매금액 합계', '10,000'],
    //        ['어플 판매금액 합계', '10,000'],
    //        ['판매취소(폐기)금액 합계', '10,000'],
    //     ];
    // }, [queryClient, franCode]); // EtcSearchDetail 내부 데이터

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
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };

            try {
                Utils.excelDownload(tableRef.current, options, '실물 상품권 재고 상세 내역');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            {isSearching ?
                <EtcDetailTableFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} />
                :
                <>
                    {/* 조회 기간 -> total 프로시저 관련 */}
                    <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResultTest} priceInfo={detailPriceInfo} />
                    {/* 게시판 -> list 프로시저 관련 */}
                    <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} ref={tableRef} />
                </>
            }

            {/* 엑셀다운, 페이징, 정렬  -> list 프로시저 관련 */}
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
}

export default GiftCardDetail