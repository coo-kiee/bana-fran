import { FC, useState, useRef, useMemo, ReactNode } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Utils from "utils/Utils";
import { format } from 'date-fns';

// state
import { franState, loginState, orderDetailModalState } from "state";

// type
import { EtcListParams, PageInfoType, OrderDetailDetailProps, OrderDetailListType } from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component   
import NoData from "pages/common/noData";
import Pagination from "pages/common/pagination";

const OrderDetailDetail: FC<OrderDetailDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo, handleSearchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);
    const setOrderDetailmodalState = useSetRecoilState(orderDetailModalState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<HTMLTableElement>(null);// 엑셀 다운로드 관련 
    const thRef = useRef<HTMLTableRowElement>(null);

    // 프로시저 
    const etcOrderDetailListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData } = ETC_SERVICE.useOrderDetailList(etcOrderDetailListParam);

    const [renderTableList, totalSumObj]: [JSX.Element[], string[][]] = useMemo(() => {
        const tableList = listData?.reduce((arr: any, tbodyRow: any, index: number) => {
            const { nOrderID, insert_date, last_modify_date, cancel_date, staff_name, last_modify_staff, cacel_staff, state_name, order_count, first_item, amount } = tbodyRow as OrderDetailListType;
            const handlePopupOrderDetail = () => {
                setOrderDetailmodalState((prevState) => ({ ...prevState, show: true, orderCode: nOrderID }));
            };

            arr.push(
                <>
                    <td className='align-center'>{format(new Date(insert_date), 'yyyy/MM/dd hh:mm')}</td>
                    <td className='align-center'>{format(new Date(last_modify_date), 'yyyy/MM/dd hh:mm')}</td>
                    <td className='align-center'>{format(new Date(cancel_date), 'yyyy/MM/dd hh:mm')}</td>
                    <td className='align-center'>{staff_name}</td>
                    <td className='align-center'>{last_modify_staff}</td>
                    <td className='align-center'>{cacel_staff}</td>
                    <td className='align-center'>{state_name}</td>
                    <td className='align-right'>{Utils.numberComma(order_count)}</td>
                    <td className='align-left order-view' onClick={handlePopupOrderDetail}>{order_count > 1 ? `${first_item} 외 ${order_count - 1}건` : first_item}</td>
                    <td className='align-right'>{`${Utils.numberComma(amount)}원`}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);

        const sumObj = [
            ['총 발주금액 합계: ', `${Utils.numberComma(listData?.reduce((acc, cur) => acc += cur.amount, 0))}원`]
        ];
        return [tableList, sumObj];
    }, [listData, setOrderDetailmodalState])

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
                        return <li key={`etc_search_detail_result_${idx}`} className="hyphen">{title}<span className="colon"></span><span className="value">{value}</span></li>
                    })}
                </ul>
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

export default OrderDetailDetail;
