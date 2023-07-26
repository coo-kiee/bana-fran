import { FC, useState, useRef, useMemo, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient, useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, subMonths } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";
import EtcDetailSummary from '../component/EtcDetailSummary';
import Sticky from 'pages/common/sticky'; 
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage'; 
import CalanderSearch from 'pages/common/calanderSearch';
import EtcDetailTableBottom from '../component/EtcDetailTableBottom';

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, VirtualAccountDetailProps, SearchInfoType } from 'types/etc/etcType'   

const VirtualAccountDetail: FC<Omit<VirtualAccountDetailProps, 'searchInfo' | 'etcVirtualAccBalanceListKey'>> = (props) => { 
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
    const etcVirtualAccBalanceListKey = useMemo(() => ['etc_virtual_acc_detail_list', JSON.stringify({ franCode, from: searchInfo.from, to: searchInfo.to }) ], [franCode, searchInfo.searchTrigger]);

    // 검색
    const handleRefetch = () => {
        queryClient.removeQueries({ queryKey:etcVirtualAccBalanceListKey, exact: true }); // 쿼리 제거 
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger })); // =refetch
    };

    // fallback props 정리
    const defaultFallbackProps = { 
        searchDate: `${searchInfo.from} ~ ${searchInfo.to}`,
        summaryResult: [
            ['충전', '0'],
            ['차감', '0'], 
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
                    <VirtualAccountDetailData searchInfo={searchInfo} etcVirtualAccBalanceListKey={etcVirtualAccBalanceListKey} {...props} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

const VirtualAccountDetailData: FC<VirtualAccountDetailProps> = ({ detailTableColGroup, detailTableHead, etcVirtualAccBalanceListKey, searchInfo: {from, to} }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 20, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // TODO: 데이터 
    const { data: listData, isSuccess, isError, isLoading, isRefetching } = ETC_SERVICE.useVirtualAccList(etcVirtualAccBalanceListKey, [franCode, from, to ]);

    const [renderTableList, summaryResult]: [ReactNode[] | undefined, string[][]] = useMemo(() => { 
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow) => {
            const { balance, deposit, division, log_date, etc, state } = tbodyRow; 

            arr.push(
                <>
                    <td className='align-center'>{log_date}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{division}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{Utils.numberComma(deposit)}</td>
                    <td className='align-center'>{state}</td>
                    <td className='balance'>{Utils.numberComma(balance)}</td>
                    <td className='align-left'>{etc}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);

        const summaryResult = [
            ['충전', Utils.numberComma(listData?.filter((el: any) => el.division === '충전').reduce((acc: any, cur: any) => acc+= cur.deposit,0) || 0)], // 총 충전 금액
            ['차감', Utils.numberComma(listData?.filter((el: any) => el.division === '차감').reduce((acc: any, cur: any) => acc+= cur.deposit,0) || 0)] // 총 차감 금액
        ]

        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동
        return [tableList, summaryResult];
    }, [listData]);

    const virtualAccDetailTablebody = useMemo(() => {  
        const isTableSuccess = isSuccess && !isLoading && !isRefetching; // 모두 성공 + refetch나 loading 안하고 있을때 
        const isTableLoading = isLoading || isRefetching ; // 처음으로 요청 || refetch 하는 경우 

        if( isTableSuccess ) {
            return <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
        } else if( isError ) { 
            return <tbody><SuspenseErrorPage isTable={true} /></tbody>
        } else if( isTableLoading ){
            return <tbody><Loading isTable={true} /></tbody>
        } 
    }, [isSuccess, isLoading, isRefetching, isError, pageInfo, renderTableList]); 

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        const branchName = f_list.filter((el) => el.f_code === franCode)[0].f_code_name;
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X 
                colspan: detailTableColGroup.map(wpx => ({ wpx: wpx !== '*' ? Number((Number(wpx.replace("%", "")) * 1540 / 100).toFixed(2)) : 400 })), 
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_가상계좌내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 

    return (
        <> 
            <EtcDetailSummary searchDate={`${from} ~ ${to}`} summaryResult={summaryResult} />

            <Sticky reference={thRef.current} contentsRef={tableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/> 
                {virtualAccDetailTablebody}
            </table>
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={renderTableList.length} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}

export default VirtualAccountDetail;