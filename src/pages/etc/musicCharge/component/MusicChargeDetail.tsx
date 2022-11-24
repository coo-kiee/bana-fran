import React, { FC, useState, useRef, useCallback, useMemo, ReactNode } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, isAfter, lastDayOfMonth, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { EtcListParams, PageInfoType, SearchInfoType, MusicChargeDetailProps } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component 
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import { EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";

const MusicChargeDetail: FC<MusicChargeDetailProps> = ({ detailPriceInfo, detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <MusicChargeDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
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
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 관련

    // 프로시저
    let detailTableBody: any[] = [];
    const etcMusicListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
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

    const renderTableList = useMemo(() => {
        return listData?.reduce((arr: any, tbodyRow: any) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow;
            const tempData = { std_date, state, suply_amount, tax_amount, total_amount };

            const handleText = (keyName: string, value: string | number) => {
                if (keyName === 'suply_amount' || keyName === 'tax_amount') return Utils.numberComma(value);
                else if (keyName === 'total_amount') return <strong>{Utils.numberComma(value)}</strong>
                else return value;
            };

            const handleClassName = (keyName: string) => {
                if (keyName === 'std_date') return 'align-center'
                else if (keyName === 'state') return 'align-left'
                else return 'align-right'
            };

            arr.push(
                <>
                    {Object.entries(tempData).map((bodyItem: [string, string | number], idx: number) => {  // ? 프로시저 데이터 확인 후 수정
                        return <td key={`etc_music_charge_detail_tbody_${idx}`} className={handleClassName(bodyItem[0])}>{handleText(bodyItem[0], bodyItem[1])}</td>
                    })}
                </>
            )
            return arr;
        }, [] as ReactNode[]);
    }, [listData])

    return (
        <>
            <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={renderTableList} pageInfo={pageInfo} ref={tableRef} />
            <EtcDetailFooter
                dataCnt={detailTableBody.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`음악서비스이용료내역`}
            />
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