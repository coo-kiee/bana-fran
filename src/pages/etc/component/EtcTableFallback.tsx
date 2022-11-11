import { format, subMonths, lastDayOfMonth } from 'date-fns';

import { OverallFallbackProps, DetailFallbackProps } from "types/etc/etcType"

import Loading from 'pages/common/loading';

// DeliveryChargeOverall Fallback 
const OverallFallback: React.FC<OverallFallbackProps> = ({ tableColGroup, tableHead }) => {
    return (
        <>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {tableColGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                </colgroup>
                <thead>
                    <tr>
                        {tableHead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={11}><Loading width={100} height={100} /></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

// DeliveryChargeTable Fallback 
const TableFallback: React.FC<DetailFallbackProps> = ({ detailTableColGroup, detailTableHead, detailPriceInfo }) => {
    return (
        <>
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {format(subMonths(new Date(), 1), 'yyyy-MM-01')}~{format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')}</p>
                </div>
                <div className="price-info">
                    {detailPriceInfo && detailPriceInfo.map((info, idx) => {
                        return info.length > 1 ?
                            <p key={`etc_search_detail_info_${idx}`} className="hyphen"><span>{info[0]}</span><span className="colon"></span>{info[1]}</p>
                            :
                            <p key={`search_detail_${idx}`} className="hyphen">{info}</p>
                    })}
                </div>
            </div>

            <table className="board-wrap" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {detailTableColGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                </colgroup>
                <thead>
                    {detailTableHead.map((theadRow, idx) => {
                        return (
                            <tr key={`etc_Detail_table_head_row_${idx}`}>
                                {theadRow.map((headItem, idx) => {
                                    const { itemName, rowSpan, colSpan, className } = headItem;
                                    return <th key={`etc_detail_table_thead_${idx}`} className={className || ''} rowSpan={rowSpan || undefined} colSpan={colSpan || undefined}>{itemName}</th>
                                })}
                            </tr>
                        )
                    })}
                </thead>
                <tbody>
                    <tr><td colSpan={11}><Loading width={50} height={50} /></td></tr>
                </tbody>
            </table>

        </>
    );
}

export { OverallFallback, TableFallback }