import React from "react";

// type
interface EtcTableProps {
    title: string, // 제목
    colGroup: Array<string>, // colgroup width 관련 ... ["188", "*", ...]
    thead: Array<string>, // 테이블 header th 관련 ... ["기간", "품목", ... ]
    tbody: any, // ? 프로시저 데이터 확인하기
    handleClassName?: any, // td styling fn 
    strong?: boolean, // <strong></strong> 사용여부
}

// TODO: 기타내역 페이지 상위 부분 (수수료내역 / 재고 현황 / 월별 발주내역 / 로열티 내역 / 가상계좌 잔액) (.board-wrap board-top 부분)
const EtcTable: React.FC<EtcTableProps> = ({ tbody }) => {
    // TODO: className 관련
    const handleClassNameDefault = (idx: number) => {
        if (idx === 0) return 'align-center';
        else if (idx === 1) return 'align-left';
        else return 'align-right';
    };

    return (
        <>
            {tbody.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className || handleClassNameDefault(idx)}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })}
        </>
    )
}


export default EtcTable;