// type
import { PageInfoType } from "types/etcType";
interface EtcDetailTableProps {
    colGroup: Array<string>, // colgroup width 관련 ... ["195", "195", ...]
    theadData: TableHeadItemType[][], // 테이블 header th 관련 ...[ [{itemName: '기간', rowSpan: 2},{itemName: 'BGM 서비스 이용료' colSpan: 3,className:'price-area'},...], [{itemName: '공급가', className: 'price-area'}] ]
    tbodyData: any, // ? 프로시저 데이터 확인하기
    pageInfo: PageInfoType, // 페이지네이션 관련 정보
}
interface TableHeadItemType {
    itemName: string, // th 이름 ... '기간'
    rowSpan?: number, // rowSpan 
    colSpan?: number, // colSpan
    className?: string, // className 필요한 경우 사용
}

// TODO: 상세 내역 테이블 관련 (.board-wrap 부분)
const EtcDetailTable: React.FC<EtcDetailTableProps> = ({ colGroup, theadData, tbodyData, pageInfo: { currentPage, row } }) => {
    return (
        <table className="board-wrap" cellPadding="0" cellSpacing="0">
            <colgroup>
                {colGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
            </colgroup>
            <thead>
                {theadData.map((theadRow, idx) => {
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
                {tbodyData.map((tbodyRow: any, idx: number) => {
                    if (
                        (idx < (currentPage - 1) * row) || // 현재 페이지 이전에 있는 데이터
                        (idx >= (currentPage * row)) // 현재 페이지 이후에 있는 데이터
                    ) return null;
                    return (
                        <tr key={`etc_Detail_table_body_row_${idx}`}>
                            {tbodyRow.map((bodyItem: any, idx: number) => {  // ? 프로시저 데이터 확인 후 수정
                                return <td key={`etc_detail_table_tbody_${idx}`} className="align-center">{bodyItem}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default EtcDetailTable;