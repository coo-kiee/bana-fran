import React from "react";

// type
interface EtcTableProps {
    title: string, // 제목
    colGroup: Array<string>, // colgroup width 관련 ... ["188", "*", ...]
    thead: Array<string>, // 테이블 header th 관련 ... ["기간", "품목", ... ]
    tbody: any // ? 프로시저 데이터 확인하기
}

// TODO: 기타내역 페이지 상위 부분 (수수료내역 / 재고 현황 / 월별 발주내역 / 로열티 내역 / 가상계좌 잔액) (.board-wrap board-top 부분)
const EtcTable: React.FC<EtcTableProps> = ({ title, colGroup, thead, tbody }) => {
    // TODO: className 관련
    const handleClassName = (idx: number) => {
        if (idx === 0) return 'align-center';
        else if (idx === 1) return 'align-left';
        else return 'align-right';
    };

    return (
        <>
            <p className="title bullet">{title}</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {colGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                </colgroup>
                <thead>
                    <tr>
                        {thead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {tbody.map((tr: any, idx: number) => {
                        return (
                            <tr key={`etc_table_tr_${idx}`}>
                                {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={handleClassName(idx)}>{td}</td>)}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default EtcTable;