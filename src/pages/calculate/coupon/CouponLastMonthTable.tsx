/* eslint-disable */
import { FC } from "react";

interface CouponLastMonthTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
};
const CouponLastMonthTable: FC<CouponLastMonthTableProps> = ({ userInfo }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    const now = new Date();
    const year = now.getFullYear();
    const lastMonth = now.getMonth() - 1;

    // const { data: boardList } = BOARD_SERVICE.useBoardList(['boardList', JSON.stringify(listSearchCondition)], listSearchCondition);
    // const { out: pageInfo } = boardList as BoardListResult || {};

    const { width, headerText } = TABLE_COLUMN_INFO;

    return (
        <>
            <p className="title bullet">{year}년 {lastMonth}월 본사 쿠폰 결제 내역</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    <TableList />
                </tbody>
            </table>
        </>
    );
}

export default CouponLastMonthTable;




const TABLE_COLUMN_INFO = {
    width: ['218', '*', '130', '130', '130'],
    headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
} as const;

interface TableListProps {
};
const TableList: FC<TableListProps> = ({ }) => {

    // const { list, out: pageInfo } = boardList;
    // const { total_cnt } = pageInfo;

    return (
        <>
            <tr>
                <td className="align-center">22/06/01~22/06/30</td>
                <td className="align-left">본사가 발행하는 이벤트/프로모션/서비스 쿠폰 등의 고객 사용비용 보전</td>
                <td className="align-right">100,000</td>
                <td className="align-right">10,00</td>
                <td className="align-right">110,000</td>
            </tr>
            {/* {!!!total_cnt && <tr><td colSpan={TABLE_COLUMN_INFO.width.length}>No Data</td></tr>} */}
            {/* <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >해당 월 정산내역 처리중입니다</td></tr> */}
        </>
    )
};