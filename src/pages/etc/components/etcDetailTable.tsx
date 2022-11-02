// type
interface EtcDetailTableProps {
    colGroup: Array<string>, // colgroup width 관련 ... ["195", "195", ...]
    theadData: TableHeadItemType[][], // 테이블 header th 관련 ...[ [{itemName: '기간', rowSpan: 2},{itemName: 'BGM 서비스 이용료' colSpan: 3,className:'price-area'},...], [{itemName: '공급가', className: 'price-area'}] ]
    tbodyData: any, // ? 프로시저 데이터 확인하기
}
interface TableHeadItemType {
    itemName: string, // th 이름 ... '기간'
    rowSpan?: number, // rowSpan 
    colSpan?: number, // colSpan
    className?: string, // className 필요한 경우 사용
}

// TODO: 상세 내역 테이블 관련 (.board-wrap 부분)
const EtcDetailTable: React.FC<EtcDetailTableProps> = ({ colGroup, theadData, tbodyData }) => {
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
                {/* <tr>
                    <th rowSpan={2}>일시</th>
                    <th rowSpan={2}>구분</th>
                    <th rowSpan={2}>상품권종</th>
                    <th rowSpan={2}>수령(금액)</th>
                    <th rowSpan={2}>판매기기</th>
                    <th rowSpan={2}>가상계좌<br />충전/차감</th>
                    <th colSpan={3} className="price-area">재고</th>
                </tr>
                <tr>
                    <td className="price-area">1만원권</td>
                    <td className="price-area">3만원권</td>
                    <td className="price-area">5만원권</td>
                </tr> */}
            </thead>
            <tbody>
                {tbodyData.map((tbodyRow: any, idx: number) => {
                    return (
                        <tr key={`etc_Detail_table_body_row_${idx}`}>
                            {tbodyRow.map((bodyItem: any, idx: number) => {  // ? 프로시저 데이터 확인 후 수정
                                return <td key={`etc_detail_table_tbody_${idx}`} className="align-center">{bodyItem}</td>
                            })}
                        </tr>
                    )
                })}
                {/* <tr>
                    <td className="align-center">2022/12/31 12:30</td>
                    <td className="align-center">판매취소(폐기)</td>
                    <td className="align-center">3만원</td>
                    <td className="align-center">1장 (30,000)</td>
                    <td className="align-center">어플</td>
                    <td className="align-right">+10,000</td>
                    <td></td>
                    <td></td>
                    <td className="align-center">1장 (50,000)</td>
                </tr>
                <tr>
                    <td className="align-center">2022/12/31 12:30</td>
                    <td className="align-center">판매취소(폐기)</td>
                    <td className="align-center">3만원</td>
                    <td className="align-center">1장 (30,000)</td>
                    <td className="align-center">어플</td>
                    <td className="align-right negative-value">-10,000</td>
                    <td className="align-center">1장 (10,000)</td>
                    <td className="align-center">1장 (30,000)</td>
                    <td></td>
                </tr> */}
            </tbody>
        </table>
    )
}

export default EtcDetailTable;