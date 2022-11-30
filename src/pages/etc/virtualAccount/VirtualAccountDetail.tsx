import React, { FC, useState, useRef, useMemo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, isAfter, lastDayOfMonth } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, EtcListParams, VirtualAccountDetailProps } from 'types/etc/etcType'  
import Pagination from 'pages/common/pagination';
import Sticky from 'pages/common/sticky'; 
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage'; 

const VirtualAccountDetail: FC<VirtualAccountDetailProps> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;

    // 게시판 + 엑셀다운, 페이징, 정렬
    const { reset } = useQueryErrorResetBoundary();

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                <VirtualAccountDetailData {...props} />
            </ErrorBoundary>
        </React.Suspense>
    )
}

const VirtualAccountDetailData: FC<VirtualAccountDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // TODO: 데이터   
    const etcVirtualAccBalanceListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData, isSuccess, isError, isLoading } = ETC_SERVICE.useVirtualAccList(etcVirtualAccBalanceListParam);

    const [renderTableList, deductTotal, depositTotal]: [ReactNode[] | undefined, number, number] = useMemo(() => {
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

        const depositTotal = listData?.filter((el: any) => el.division === '충전').reduce((acc: any, cur: any) => acc+= cur.deposit,0) || 0;
        const deductTotal = listData?.filter((el: any) => el.division === '차감').reduce((acc: any, cur: any) => acc+= cur.deposit,0) || 0;

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
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_발주내역`;
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
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
                <ul className="search-result">
                    <li className="hyphen">충전<span className="colon"></span><span className="value">{Utils.numberComma(depositTotal)}원</span></li>
                    <li className="hyphen">차감<span className="colon"></span><span className="value">{Utils.numberComma(deductTotal)}원</span></li>
                </ul>
            </div>

            <Sticky reference={thRef.current}>
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