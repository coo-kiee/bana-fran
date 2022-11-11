import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient } from "react-query";
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// state
import { franState } from "state";

// type
import { EtcListParams, PageInfoType, SearchInfoType, MusicChargeDetailProps } from "types/etc/etcType";

// API
import { useEtcList } from 'service/etcService';

// component 
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const MusicChargeDetail: React.FC<MusicChargeDetailProps> = ({ detailPriceInfo, detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // 상태
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // .board-wrap table 관련 (가장 하단 테이블)
    // TODO: 이후에 테스트 데이터 보고 타입 지정 + 수정
    // ['22/06/01~22/06/30', '아메리카노 외 1건', '1,000', '2,900', '현장카드', '카드, 바나포인트', '0101234****', '130,000', '130,000', '130,000'],
    // let detailTableBody = useMemo((data:any) => data.filter((el:any) => el.type === searchInfo.searchOption.type), [searchInfo.searchOption.type]); 
    let detailTableBody = [];

    // 프로시저 
    const etcMusicListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData, isSuccess: etcDeliveryListSuccess } = useEtcList<EtcListParams>('VK4WML6GW9077BKEWP3O', etcMusicListParam, 'etc_music_list');

    if (etcDeliveryListSuccess) {
        detailTableBody = listData
    }

    let detailSearchResultTest = useCallback(() => {
        const data: any = queryClient.getQueryData(['etc_music_fee', franCode]);

        return [
            ['음악 사용료 합계', `${data.suply_fee}`],
            ['공연권료 합계', `${data.suply_fee_tax}`],
        ];
    }, [queryClient, franCode]); // EtcSearchDetail 내부 데이터
    // 엑셀 다운로드 관련 
    const test = useRef<null | HTMLTableElement>(null);
    const handleExcelPrint = () => {
        if (test.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: `${searchInfo.from}~${searchInfo.to}`, // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };

            try {
                Utils.excelDownload(test.current, options, '바나 딜리버리 수수료');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            {/* 검색 -> 관련 X */}
            <CalanderSearch
                title={`상세내역`}
                dateType={'yyyy-MM-dd'}
                searchInfo={tempSearchInfo}
                setSearchInfo={setTempSearchInfo}
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

export default MusicChargeDetail; 