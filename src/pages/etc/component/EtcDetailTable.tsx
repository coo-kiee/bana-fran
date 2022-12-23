import { FC, forwardRef, ReactNode } from "react"; 

// component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage"; 
import NoData from "pages/common/noData";  
import EtcDetailSummary from "./EtcDetailSummary";

// type
import { PageInfoType, TableHeadItemType } from "types/etc/etcType";
import { ExtraOverallTableRowItemType } from "types/membership/extraType";

interface EtcDetailTableProps {
    tbodyData: ReactNode[] | undefined, // ? 프로시저 데이터 확인하기
    pageInfo: PageInfoType, // 페이지네이션 관련 정보 
}

// TODO: 상세 내역 테이블 관련 (.board-wrap 부분)
const EtcDetailTable: FC<EtcDetailTableProps> = ({ tbodyData, pageInfo: { currentPage, row } }) => { 
    return (
        <tbody>
            {(!!tbodyData && tbodyData.length > 0) && tbodyData.map((item: any, index: number) => {
                const isCurrentPage = (index >= (currentPage - 1) * row && index < currentPage * row);
                return (<tr key={index} style={{ display: isCurrentPage ? '' : 'none' }}>{item}</tr>);
            })}
            {!!tbodyData && tbodyData?.length === 0 && <NoData isTable={true} />}
        </tbody>
    )
}

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
    fallbackType: string,
    resetErrorBoundary?: () => void,
    searchDate?: string,
    summaryResult?: string[][],
    summaryInfo?: string[][],
    detailTableColGroup: string[],
    detailTableHead: ExtraOverallTableRowItemType[][] | TableHeadItemType[][],
}

const EtcDetailTableFallback: FC<EtcDetailTableFallbackProps> = ({ fallbackType, resetErrorBoundary, searchDate, summaryResult, summaryInfo, detailTableColGroup, detailTableHead}) => {
    return (
        <>
            {searchDate && summaryResult && summaryInfo && <EtcDetailSummary searchDate={searchDate} summaryResult={summaryResult} summaryInfo={summaryInfo} />} 
            <table className="board-wrap" cellPadding="0" cellSpacing="0"> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                <tbody>
                    {fallbackType === 'LOADING' && <Loading isTable={true} />}
                    {fallbackType === 'ERROR' && !!resetErrorBoundary && <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true}/>}
                </tbody>
            </table>
        </>
    )
}

export default EtcDetailTable;
export { EtcDetailTableHead, EtcDetailTableFallback };