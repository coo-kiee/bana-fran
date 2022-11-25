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
import { PageInfoType, EtcListParams, RoyaltyDetailProps } from 'types/etc/etcType';
import EtcSearchDetail from 'pages/etc/component/EtcSearchDetail';
import Pagination from 'pages/common/pagination';
import NoData from 'pages/common/noData';

const RoyaltyDetail: FC<Omit<RoyaltyDetailProps, 'title'>> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;
    // 게시판 + 엑셀다운, 페이징, 정렬
    const { reset } = useQueryErrorResetBoundary();
    const title = `월별 발주금액 통계`;

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                {/* 로열티 내역 */}
                <RoyaltyDetailData title={title} {...props} />
            </ErrorBoundary>
        </React.Suspense>
    )
}

const RoyaltyDetailData: FC<RoyaltyDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, detailPriceInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<null | HTMLTableElement>(null); // 엑셀 다운로드 관련

    // 프로시저 
    const etcRoyaltyListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData } = ETC_SERVICE.useEtcList<EtcListParams>('YGQA4CREHNZCZIXPF2AH', etcRoyaltyListParam, 'etc_royalty_list');
    const [renderTableList, totalSumObj]: [ReactNode[], string[][]] = useMemo(() => {
        let royaltyTotal = 0;
        let stageTotal = 0;

        const tableList = listData?.reduce((arr: any, tbodyRow: any, index: number) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow;
            if (state.includes('로열티')) {
                royaltyTotal += total_amount;
            } else if (state.includes('공연')) {
                stageTotal += total_amount;
            };

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

        const sumObj = [
            ['로열티 합계', `${Utils.numberComma(royaltyTotal)}`], ['공연권료 합계', `${Utils.numberComma(stageTotal)}`]
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
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
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
            {/* <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={totalSumObj} priceInfo={detailPriceInfo} /> */}
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
                <div className="price-info">
                    <p className="hyphen">로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
                </div>
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

            {/* <EtcDetailFooter
                dataCnt={detailTableBody.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`로열티내역`}
            /> */}
        </>
    )
}

export default RoyaltyDetail;