import { FC, useState, useRef, useMemo, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, isAfter, lastDayOfMonth, subMonths } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component
import EtcDetailTable, { EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, VirtualAccountDetailProps, SearchInfoType } from 'types/etc/etcType'  
import Pagination from 'pages/common/pagination';
import Sticky from 'pages/common/sticky'; 
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage'; 
import CalanderSearch from 'pages/common/calanderSearch';

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
    const { virtualAccListFrom, virtualAccListTo } = {
        virtualAccListFrom: from + '-01',
        virtualAccListTo: isAfter(lastDayOfMonth(new Date(to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(to)), 'yyyy-MM-dd')
    } 
    // eslint-disable-next-line
    const etcVirtualAccBalanceListKey = useMemo(() => ['etc_virtual_acc_detail_list', JSON.stringify({ franCode, from:virtualAccListFrom , to:virtualAccListTo }) ], [franCode, searchTrigger]);
    const { data: listData, isSuccess, isError, isLoading } = ETC_SERVICE.useVirtualAccList(etcVirtualAccBalanceListKey, [franCode, virtualAccListFrom, virtualAccListTo ]);

    const [renderTableList, depositTotal, deductTotal]: [ReactNode[] | undefined, number, number] = useMemo(() => {
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow) => {
            const { balance, deposit, division, log_date, state } = tbodyRow; 

            arr.push(
                <>
                    <td className='align-center'>{format(new Date(log_date), 'yyyy/MM/dd hh:mm')}</td>
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

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${f_list[0].f_code_name}_발주내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };
    const handlePageChange = (changePage: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, currentPage: changePage }))
    }
    const handlePageRow = (row: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, row: row }))
    }

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
                {isSuccess && <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> }
                {isLoading && <tbody><Loading isTable={true} /></tbody>}
                {isError && <tbody><SuspenseErrorPage isTable={true} /></tbody>} 
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={!!renderTableList ? renderTableList.length : 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div> 
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