import { FC, useState, useRef, useMemo, ReactNode, Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, subMonths } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component
import EtcDetailTable, { EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";
import Sticky from 'pages/common/sticky'; 
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage'; 
import CalanderSearch from 'pages/common/calanderSearch';
import EtcDetailTableBottom from '../component/EtcDetailTableBottom';

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, VirtualAccountDetailProps, SearchInfoType } from 'types/etc/etcType'   

const VirtualAccountDetail: FC<Omit<VirtualAccountDetailProps, 'searchInfo'>> = (props) => { 
    const { reset } = useQueryErrorResetBoundary();
    
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11  
        searchTrigger: false,
    }); // etcSearch 내부 검색 날짜

    return (
        <>
            <VirtualAccountSearch searchInfo={searchInfo} setSearchInfo={setSearchInfo} />
            <Suspense fallback={<Loading marginTop={120} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                    <VirtualAccountDetailData searchInfo={searchInfo} {...props} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

const VirtualAccountDetailData: FC<VirtualAccountDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo: {from, to, searchTrigger} }) => {
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
    // eslint-disable-next-line
    const etcVirtualAccBalanceListKey = useMemo(() => ['etc_virtual_acc_detail_list', JSON.stringify({ franCode, from , to }) ], [franCode, searchTrigger]);
    const { data: listData, isSuccess, isError, isLoading, isRefetching, refetch } = ETC_SERVICE.useVirtualAccList(etcVirtualAccBalanceListKey, [franCode, from, to ]);
    useEffect(() => {
        refetch();
    }, [franCode, searchTrigger, refetch])

    const [renderTableList, depositTotal, deductTotal]: [ReactNode[] | undefined, number, number] = useMemo(() => {
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow) => {
            const { balance, deposit, division, log_date, state } = tbodyRow; 

            arr.push(
                <>
                    <td className='align-center'>{log_date}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{division}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{Utils.numberComma(deposit)}</td>
                    <td className='align-center'>{state}</td>
                    <td className='balance'>{Utils.numberComma(balance)}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);

        const depositTotal = listData?.filter((el: any) => el.division === '충전').reduce((acc: any, cur: any) => acc+= cur.deposit,0) || 0; // 총 충전 금액
        const deductTotal = listData?.filter((el: any) => el.division === '차감').reduce((acc: any, cur: any) => acc+= cur.deposit,0) || 0; // 총 차감 금액

        return [tableList, depositTotal, deductTotal];
    }, [listData]);

    const virtualAccDetailTablebody = useMemo(() => { 
        const isTableSuccess = isSuccess && !isLoading && !isRefetching; // 모두 성공 + refetch나 loading 안하고 있을때 
        const isTableLoading = isLoading || isRefetching ; // 처음으로 요청 || refetch 하는 경우 

        if( isTableSuccess ) {
            return <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
        } else if( isError ) { // 실패한 경우 
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
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_발주내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 

    return (
        <> 
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {from} ~ {to}</p>
                </div>
                <ul className="search-result">
                    <li className="hyphen">충전<span className="colon"></span><span className="value">{Utils.numberComma(depositTotal)}원</span></li>
                    <li className="hyphen">차감<span className="colon"></span><span className="value">{Utils.numberComma(deductTotal)}원</span></li>
                </ul>
            </div>

            <Sticky reference={thRef.current} contentsRef={tableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/> 
                {virtualAccDetailTablebody}
            </table>

            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}

export default VirtualAccountDetail;

const VirtualAccountSearch: FC<{searchInfo:SearchInfoType, setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoType>>}> = ({  searchInfo, setSearchInfo  }) => {
    const handleRefetch = () => {
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger }));
    };

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM'}
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            handleSearch={handleRefetch} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}