import { FC, useState, useRef, useMemo, ReactNode, Suspense } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { PageInfoType, MusicChargeDetailProps, MusicChargeDetailType, SearchInfoType, FALLBACK_TYPE } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component 
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";
import EtcDetailTableBottom from "../component/EtcDetailTableBottom";
import Sticky from "pages/common/sticky"; 
import CalanderSearch from "pages/common/calanderSearch"; 
import EtcDetailSummary from "../component/EtcDetailSummary";

const MusicChargeDetail: FC<Omit<MusicChargeDetailProps, 'searchInfo' | 'etcMusicListKey'>> = (props) => {
    const { reset } = useQueryErrorResetBoundary();
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // state
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-11
        to: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-11
        searchTrigger: false,
    });

    // key
    // eslint-disable-next-line
    const etcMusicListKey = useMemo(() => ['etc_music_list', JSON.stringify({ franCode, from: searchInfo.from, to: searchInfo.to }) ], [franCode, searchInfo.searchTrigger]);
    
    // 검색
    const handleRefetch = () => {
        queryClient.removeQueries({ queryKey:etcMusicListKey, exact: true }); // 쿼리 제거 
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger })); // =refetch
    };

    // fallback props 정리
    const defaultFallbackProps = { 
        searchDate: `${searchInfo.from} ~ ${searchInfo.to}`,
        summaryResult: [
            ['음악 사용료 합계', '0'],
            ['공연권료 합계', '0']
        ], 
        ...props
    }
    const loadingFallbackProps = { ...defaultFallbackProps, fallbackType: FALLBACK_TYPE.LOADING }
    const errorFallbackProps = { ...defaultFallbackProps, fallbackType: FALLBACK_TYPE.ERROR }

    return (
        <>
            <CalanderSearch
                title={`상세내역`}
                dateType={'yyyy-MM'}
                searchInfo={searchInfo}
                setSearchInfo={setSearchInfo}
                handleSearch={handleRefetch}
                showMonthYearPicker={true}
            />

            <Suspense fallback={<EtcDetailTableFallback {...loadingFallbackProps} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback {...errorFallbackProps} resetErrorBoundary={resetErrorBoundary} />} >
                    <MusicChargeDetailData {...props} etcMusicListKey={etcMusicListKey} searchInfo={searchInfo} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default MusicChargeDetail;

const MusicChargeDetailData: FC<MusicChargeDetailProps> = ({ searchInfo: { from, to }, etcMusicListKey, summaryInfo, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, 
        row: 20, 
    });
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // TODO: 데이터 
    const { data: listData } = ETC_SERVICE.useEtcList<MusicChargeDetailType[]>('VK4WML6GW9077BKEWP3O', etcMusicListKey, [ franCode, from, to ]);

    const [renderTableList, summaryResult]: [ReactNode[] | undefined, string[][]] = useMemo(() => { 
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow; 
            arr.push(
                <>
                    <td className='align-center'>{std_date}</td>
                    <td className='align-left'>{state}</td>
                    <td className='align-right'>{Utils.numberComma(suply_amount)}</td>
                    <td className='align-right'>{Utils.numberComma(tax_amount)}</td>
                    <td className='align-right'>{Utils.numberComma(total_amount)}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]); 

        const summaryResult = [
            ['음악 사용료 합계', Utils.numberComma(listData?.filter((el: any) => el.state.includes('음악')).reduce((acc: any, cur: any) => acc+= cur.total_amount, 0) || 0)],
            ['공연권료 합계', Utils.numberComma(listData?.filter((el: any) => el.state.includes('공연')).reduce((acc: any, cur: any) => acc+= cur.total_amount, 0) || 0)]
        ]

        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동
        return [tableList, summaryResult];
    }, [listData]) 

    const handleExcelDownload = () => {
        const branchName = f_list.filter((el) => el.f_code === franCode)[0].f_code_name;
        if (tableRef.current) {
            const options = {
                type: 'table',
                // sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_음악서비스내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 

    return (
        <>
            <EtcDetailSummary searchDate={`${from} ~ ${to}`} summaryResult={summaryResult} summaryInfo={summaryInfo} />

            <Sticky reference={thRef.current} contentsRef={tableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/>
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
            </table>
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={renderTableList.length} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}