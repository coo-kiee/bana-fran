import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient } from "react-query";
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// state
import { franState } from "state";

// type
import { EtcListParams, PageInfoType, DeliveryChargeDetailProps, SearchInfoSelectType, ETC_DELIVERY_SEARCH_OPTION_TYPE, ETC_DELIVERY_SEARCH_OPTION_LIST } from "types/etc/etcType";

// API
import { useEtcList } from 'service/etcService';

// component 
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const DeliveryChargeDetail: React.FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo, detailPriceInfo }) => {
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // TODO: 상태
    const tableRef = useRef<null | HTMLTableElement>(null);
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [{ value: 'SEARCH_0', title: '구분 전체' }],
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 상태 관련
    const searchOptionList = [
        {
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL]: { title: '구분 전체', value: 'SEARCH_0' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD]: { title: '현장카드', value: 'SEARCH_1' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH]: { title: '현장현금', value: 'SEARCH_2' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.APP]: { title: '어플선결제', value: 'SEARCH_3' },
        }
    ];

    // TODO: 엑셀 다운로드
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
                Utils.excelDownload(tableRef.current, options, '바나 딜리버리 수수료');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    // TODO: 프로시저 관련 변수
    // 이후 테스트 데이터 보고 타입 지정 + 수정
    let detailSearchResultTest = useCallback(() => {
        const data: any = queryClient.getQueryData(['etc_delivery_total', franCode]);

        return [
            ['바나 딜리버리 주문금액 합계', `${data.suply_fee}`],
            ['바나 딜리버스 수수료 공급가(주문금액*2%) 합계', `${data.suply_fee_tax}`],
            ['바나 딜리버리 수수료(수수료 공급가+부가세) 합계', `${data.total_fee}`]
        ];
    }, [queryClient, franCode]); // EtcSearchDetail 내부 데이터

    // .board-wrap table 관련 (가장 하단 테이블)
    // ['22/06/01~22/06/30', '아메리카노 외 1건', '1,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'], 
    let detailTableBody = []; // EtcDetailTable 내부 데이터

    // TODO: 프로시저 
    const etcDeliveryListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData, isSuccess: etcDeliveryListSuccess } = useEtcList<EtcListParams>('YOCYKBCBC6MTUH9AXBM7', etcDeliveryListParam, 'etc_delivery_list');

    // TODO: 프로시저 성공 후 업데이트 (=날짜 변경 O인 경우)
    if (etcDeliveryListSuccess) {
        // 날짜 변경하여 검색하는데 옵션이 있는 경우
        const filter = searchInfo.searchOption.map((option) => option.value)
        detailTableBody = listData; // ! detailTableBody = listData.filter(...) 처리 후 담아주기
    };

    // TODO: 날짜 변경 X, 옵션만 변경하는 경우
    useEffect(() => {
        console.log(`searchOption.type 변경되었다면 실행`)
        // const data: any = queryClient.getQueryData([`etc_delivery_list`, searchInfo.from, searchInfo.to, franCode]);
        // detailTableBody = data.filter(....)
    }, [searchInfo.searchOption])

    return (
        <>
            {/* 검색 -> 관련 X */}
            <CalanderSearch
                title={`상세내역`}
                dateType={'yyyy-MM-dd'}
                searchInfo={tempSearchInfo}
                setSearchInfo={setTempSearchInfo}
                selectOption={searchOptionList}
                optionList={ETC_DELIVERY_SEARCH_OPTION_LIST}
                handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            />

            {/* 조회 기간 -> total 프로시저 관련 */}
            <EtcSearchDetail searchDate={`${tempSearchInfo.from} ~ ${tempSearchInfo.to}`} searchResult={detailSearchResultTest()} priceInfo={detailPriceInfo} />

            {/* 게시판 -> list 프로시저 관련 */}
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} />

            {/* 엑셀다운, 페이징, 정렬  -> list 프로시저 관련 */}
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
}

export default DeliveryChargeDetail; 