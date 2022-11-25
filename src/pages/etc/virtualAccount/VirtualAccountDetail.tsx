import React, { FC, useState, useRef, useMemo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, isAfter, lastDayOfMonth } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import { EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from 'pages/etc/component/EtcDetailFooter';

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, EtcListParams, VirtualAccountDetailProps, VirtualAccListType } from 'types/etc/etcType';
import EtcSearchDetail from 'pages/etc/component/EtcSearchDetail';
import NoData from 'pages/common/noData';
import Pagination from 'pages/common/pagination';

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

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 관련

    // 프로시저 
    let detailTableBody: any = [];
    const etcVirtualAccBalanceListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData } = ETC_SERVICE.useEtcList<EtcListParams>('CS4QOSEGOQGJ8QCALM7L', etcVirtualAccBalanceListParam, 'etc_virtual_acc_balance_total_list');

    const [renderTableList, totalSumObj]: [ReactNode[], string[][]] = useMemo(() => {
        let deductTotal = 0;
        let addTotal = 0;
        const tableList = listData?.reduce((arr: any, tbodyRow: any, index: number) => {
            const { balance, deposit, division, log_date, state } = tbodyRow;
            if (division.includes('차감')) deductTotal += deposit;
            else if (division.includes('충전')) addTotal += deposit;
            arr.push(
                <>
                    <td className='align-center'>{format(new Date(log_date), 'yyyy/MM/dd hh:mm')}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{division}</td>
                    <td className={`align-center ${deposit === '차감' ? `negative-value` : ''}`}>{Utils.numberComma(deposit)}</td>
                    <td className='align-center'>{state}</td>
                    <td className='balance'>{Utils.numberComma(balance)}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);

        const sumObj = [
            ['충전', `${Utils.numberComma(addTotal)}`], ['차감', `${Utils.numberComma(deductTotal)}`]
        ];

        return [tableList, sumObj];
    }, [listData]);

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
            {/* <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={totalSumObj} /> */}
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
                <ul className="search-result">
                    {totalSumObj.map((result, idx) => {
                        const [title, value] = result;
                        return <li key={`etc_search_detail_result_${idx}`} className="hyphen">{title}<span className="colon"></span><span className="value">{value}원</span></li>
                    })}
                </ul>
            </div>

            {/* <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={renderTableList} pageInfo={pageInfo} ref={tableRef} /> */}
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <colgroup>
                    {detailTableColGroup.map((el, idx) => <col key={`extra_overall_col_${idx}`} width={el} />)}
                </colgroup>
                <thead>
                    {detailTableHead.map((trData, idx1) => {
                        return (
                            <tr key={`extra_overall_table_row_${idx1}`} >
                                {trData.map((tdData, idx2) => {
                                    return (
                                        <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                            {tdData.itemName}
                                        </th>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </thead>

                <tbody>
                    {renderTableList.map((item: any, index: number) => {
                        const isCurrentPage = (index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row);
                        return (<tr key={index} style={{ display: isCurrentPage ? '' : 'none' }}>{item}</tr>);
                    })}
                    {renderTableList.length === 0 && <NoData isTable={true} />}
                </tbody>
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={renderTableList.length} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
            {/* 
            <EtcDetailFooter
                dataCnt={detailTableBody.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`가상계좌내역`}
            /> */}
        </>
    )
}

export default VirtualAccountDetail;