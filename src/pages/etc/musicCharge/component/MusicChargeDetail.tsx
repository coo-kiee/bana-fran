import React, { FC, useState, useRef, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState } from "state";

// type
import { EtcListParams, PageInfoType, SearchInfoType, MusicChargeDetailProps } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component 
import { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const MusicChargeDetail: FC<MusicChargeDetailProps> = ({ detailPriceInfo, detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <MusicChargeDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* *_list 프로시저 사용하는 컴포넌트 */}
                    <MusicChargeDetailData
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

export default MusicChargeDetail;

const MusicChargeDetailData: FC<MusicChargeDetailProps> = ({ detailPriceInfo, detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // .board-wrap table 관련 (가장 하단 테이블)
    // TODO: 이후에 테스트 데이터 보고 타입 지정 + 수정
    // ['22/06/01~22/06/30', '아메리카노 외 1건', '1,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
    // let detailTableBody = useMemo((data:any) => data.filter((el:any) => el.type === searchInfo.searchOption.type), [searchInfo.searchOption.type]); 
    let detailTableBody: any[] = [];

    // 프로시저
    // isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    const etcMusicListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: searchInfo.to + '-01'
    };
    const { data: listData, isSuccess: etcMusicListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('VK4WML6GW9077BKEWP3O', etcMusicListParam, 'etc_music_list');
    if (etcMusicListSuccess) {
        console.log('MusicChargeDetail: ', listData)
        detailTableBody = listData; // MusicChargeDetailType[]
    }
    let detailSearchResult = useMemo(() => {
        // TODO: 프로시저 데이터 확인 후 수정
        const data: any = queryClient.getQueryData(['etc_music_fee', franCode]);
        console.log(data);
        return [
            ['음악 사용료 합계', `0`],
            ['공연권료 합계', `0`],
        ];
    }, [queryClient, franCode]); // EtcSearchDetail 내부 데이터

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
                Utils.excelDownload(tableRef.current, options, '음악 서비스 이용료');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            {/* 조회 기간 -> total 프로시저 관련 */}
            <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />

            {/* 게시판 -> list 프로시저 관련 */}
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} ref={tableRef} />

            {/* 엑셀다운, 페이징, 정렬  -> list 프로시저 관련 */}
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
}

const MusicChargeDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10
        to: format(new Date(), 'yyyy-MM'), // 2022-11
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}