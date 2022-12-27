import { FC, useState, useRef, useMemo, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient, useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, subMonths } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component  
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";
import EtcDetailSummary from '../component/EtcDetailSummary';
import Sticky from 'pages/common/sticky';  
import CalanderSearch from 'pages/common/calanderSearch'; 
import EtcDetailTableBottom from '../component/EtcDetailTableBottom';

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, RoyaltyDetailProps, RoyaltyDetailListType, SearchInfoType } from 'types/etc/etcType'; 

const RoyaltyDetail: FC<Omit<RoyaltyDetailProps, 'searchInfo' | 'etcRoyaltyListKey'>> = ( props ) => { 
    const { reset } = useQueryErrorResetBoundary(); 
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // state
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10
        to: format(new Date(), 'yyyy-MM'), // 2022-11
        searchTrigger: false,
    });

    // key
    // eslint-disable-next-line
    const etcRoyaltyListKey = useMemo(() => ['etc_royalty_list', JSON.stringify({ franCode, from: searchInfo.from, to: searchInfo.to }) ], [franCode, searchInfo.searchTrigger]);

    // 검색
    const handleRefetch = () => {
        queryClient.removeQueries({ queryKey:etcRoyaltyListKey, exact: true }); // 쿼리 제거 
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger })); // =refetch
    };

    // fallback props 정리
    const defaultFallbackProps = { 
        searchDate: `${searchInfo.from} ~ ${searchInfo.to}`,
        summaryResult: [
            ['로열티 합계', '0'],
            ['공연권료 합계', '0'], 
        ], 
        ...props
    }
    const loadingFallbackProps = { ...defaultFallbackProps, fallbackType: 'LOADING' }
    const errorFallbackProps = { ...defaultFallbackProps, fallbackType: 'ERROR' }

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
                    <RoyaltyDetailData searchInfo={searchInfo} etcRoyaltyListKey={etcRoyaltyListKey} {...props} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

const RoyaltyDetailData: FC<RoyaltyDetailProps> = ({ detailTableColGroup, detailTableHead, etcRoyaltyListKey, summaryInfo, searchInfo: {from, to} }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 20, // 한 페이지에 나오는 리스트 개수 
    });
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // TODO: 데이터
    const { data: listData } = ETC_SERVICE.useEtcList<RoyaltyDetailListType[]>('YGQA4CREHNZCZIXPF2AH', etcRoyaltyListKey, [ franCode, from, to ]); 

    const [renderTableList, summaryResult]: [ReactNode[] | undefined, string[][]] = useMemo(() => { 
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow; 
            arr.push(
                <>
                    <td className='align-center'>{std_date}</td>
                    <td className='align-left'>{state}</td>
                    <td className='align-center'>{Utils.numberComma(suply_amount)}</td>
                    <td className='align-center'>{Utils.numberComma(tax_amount)}</td>
                    <td className='align-center'><strong>{Utils.numberComma(total_amount)}</strong></td>
                </>
            ) 

            return arr;
        }, [] as ReactNode[]);

        const summaryResult = [
            ['로열티 합계', Utils.numberComma(listData?.filter((el: any) => el.state.includes('로열티')).reduce((acc: any, cur: any) => acc+= cur.total_amount,0) || 0)],
            ['공연권료 합계', Utils.numberComma(listData?.filter((el: any) => el.state.includes('공연')).reduce((acc: any, cur: any) => acc+= cur.total_amount,0) || 0)]
        ];

        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동
        return [tableList, summaryResult];
    }, [listData]);

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        const branchName = f_list.filter((el) => el.f_code === franCode)[0].f_code_name;
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_발주내역`;
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

export default RoyaltyDetail;