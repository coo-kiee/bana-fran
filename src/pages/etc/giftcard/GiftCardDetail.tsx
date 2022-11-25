import React, { FC, useState, useRef, ReactNode, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, isAfter, lastDayOfMonth, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import {
    EtcListParams, PageInfoType, GiftcardDetailProps, SearchInfoSelectType,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_LIST, SearchInfoType,
} from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component 
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import { EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import CalanderSearch from "pages/common/calanderSearch";
import EtcSearchDetail from "pages/etc/component/EtcSearchDetail";
import NoData from "pages/common/noData";
import Pagination from "pages/common/pagination";

const GiftCardDetail: FC<GiftcardDetailProps> = ({ detailPriceInfo, detailTableHead, detailTableColGroup, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* *_list 프로시저 사용하는 컴포넌트 */}
                    <GiftCardDetailData
                        searchInfo={searchInfo}
                        detailPriceInfo={detailPriceInfo}
                        detailTableColGroup={detailTableColGroup}
                        detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default GiftCardDetail

const GiftCardDetailData: FC<Omit<GiftcardDetailProps, 'handleSearchInfo'>> = ({ detailPriceInfo, detailTableHead, detailTableColGroup, searchInfo }) => {
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
    const etcGiftcardListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData } = ETC_SERVICE.useEtcList<EtcListParams>('VK4WML6GW9077BKEWP3O', etcGiftcardListParam, 'etc_giftcard_list');
    const [renderTableList, totalSumObj]: [ReactNode[], string[][]] = useMemo(() => {
        const tableList = listData?.reduce((arr: any, tbodyRow: any) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow;
            const tempData = { std_date, state, suply_amount, tax_amount, total_amount };

            const handleText = (keyName: string, value: string | number) => {
                if (keyName === 'suply_amount' || keyName === 'tax_amount') return Utils.numberComma(value);
                else if (keyName === 'total_amount') return <strong>{Utils.numberComma(value)}</strong>
                else return value;
            };

            const handleclassNameName = (keyName: string) => {
                if (keyName === 'std_date') return 'align-center'
                else if (keyName === 'state') return 'align-left'
                else return 'align-right'
            };

            arr.push(
                <>
                    <td className="align-center">2022/12/31 12:30</td>
                    <td className="align-center">판매취소(폐기)</td>
                    <td className="align-center">3만원</td>
                    <td className="align-center">1장 (30,000)</td>
                    <td className="align-center">어플</td>
                    <td className="align-right">+10,000</td>
                    <td></td>
                    <td></td>
                    <td className="align-center">1장 (50,000)</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);

        const sumObj = [
            ['발주금액 합계', '10,000'],
            ['키오스크/POS 판매금액 합계', '10,000'],
            ['어플 판매금액 합계', '10,000'],
            ['판매취소(폐기)금액 합계', '10,000'],
        ];

        return [tableList, sumObj];
    }, [listData])

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
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_상품권내역`;
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
                <div className='price-info'>
                    <p className="hyphen">키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.</p>
                    <p className="hyphen">어플 판매금액은 가상계좌에서 차감되지 않습니다.</p>
                    <p className="hyphen">판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.</p>
                </div>
            </div>

            {/* <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={renderTableList} pageInfo={pageInfo} /> */}
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
                <Pagination dataCnt={renderTableList.length || 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
}
