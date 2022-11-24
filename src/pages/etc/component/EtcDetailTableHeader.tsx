import React, { FC, forwardRef, ReactNode, useRef } from "react";
import Utils from "utils/Utils";
import { format } from "date-fns";

// component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import Sticky from "pages/common/sticky";

// type
import { PageInfoType, isMusicChargeDetailType, isOrderDetailListType, isVirtualAccListType, VirtualAccListType, TableHeadItemType } from "types/etc/etcType";
import { ExtraOverallTableRowItemType } from "types/membership/extraType";
import NoData from "pages/common/noData";


interface EtcDetailTableHeadProps {
    detailTableColGroup: string[],
    detailTableHead: ExtraOverallTableRowItemType[][] | TableHeadItemType[][]
}
const EtcDetailTableHead = forwardRef<HTMLTableRowElement | null, EtcDetailTableHeadProps>(({ detailTableColGroup, detailTableHead }, ref) => {
    const handleColumnRowText = (itemName: Array<string> | string) => {
        if (Array.isArray(itemName)) { // ExtraOverallTableRowItemType 경우
            if (itemName.length > 1) return <>{itemName[0]}<p>({itemName[1]})</p></>;
            else return itemName[0];
        } else { // TableHeadItemType 경우
            return itemName;
        };
    };

    return (
        <>
            <colgroup>
                {detailTableColGroup.map((el, idx) => <col key={`extra_overall_col_${idx}`} width={el} />)}
            </colgroup>
            <thead>
                {detailTableHead.map((trData, idx1) => {
                    return (
                        <tr key={`extra_overall_table_row_${idx1}`} ref={idx1 === 0 && !!ref ? ref : undefined}>
                            {trData.map((tdData, idx2) => {
                                return (
                                    <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                        {handleColumnRowText(tdData.itemName)}
                                    </th>
                                )
                            })}
                        </tr>
                    )
                })}
            </thead>
        </>
    )
})

interface EtcDetailTableFallbackProps {
    colGroup: Array<string>,
    theadData: TableHeadItemType[][] | ExtraOverallTableRowItemType[][],
    type?: 'LOADING' | 'ERROR',
    resetErrorBoundary?: () => void,
}
const EtcDetailTableFallback: FC<EtcDetailTableFallbackProps> = ({ colGroup, theadData, type, resetErrorBoundary }) => {
    return (
        <table className="board-wrap" cellPadding="0" cellSpacing="0">
            <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={theadData} />
            <tbody>
                {type === 'LOADING' && <Loading width={100} height={100} isTable={true} />}
                {type === 'ERROR' && !!resetErrorBoundary && <SuspenseErrorPage isTable={true} resetErrorBoundary={resetErrorBoundary} />}
            </tbody>
        </table>
    )
}

export { EtcDetailTableHead, EtcDetailTableFallback }