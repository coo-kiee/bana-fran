import { FC } from "react";

interface ChangeHistoryProps {
    handlePopup: (key: string, value: boolean) => void
};
const ChangeHistory: FC<ChangeHistoryProps> = ({ handlePopup }) => {

    return (
        <div className="alert-layer history-layer active">
            <div className="msg-wrap">
                <p className="title">수정요청/변경이력</p>
                <HistoryTable />
                <button className="btn-close history-close" onClick={() => handlePopup('changeHistory', false)} ></button>
                <button className="cta-btn">등록하기</button>
            </div>
        </div>
    );
}

export default ChangeHistory;



const TABLE_COLUMN_INFO = {
    width: ['130', '90', '90', '372', '250', '250'],
    headerText: ['일시', '구분', '등록자', '수정요청/답변내용', '변경 전', '변경 후'],
} as const;

const HistoryTable: FC = () => {

    const { width, headerText } = TABLE_COLUMN_INFO;

    return (
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

    )
};

interface TableListProps {
};
const TableList: FC<TableListProps> = () => {

    // const { list, out: pageInfo } = boardList;
    // const { total_cnt } = pageInfo;

    return (
        <>
            {
                // list.map((board, index) => {

                //     const { category_name, title, attach_cnt, insert_date, rownum, important, board_id } = board;
                //     const rowNumInt = total_cnt - parseInt(rownum) + 1;
                //     const isEndBoard = index === (total_cnt - 1);
                //     const isImportant = important === "1";

                //     return (
                //         <tr className={isImportant ? "important" : ""} key={rowNumInt} >
                //             <td className={isImportant ? "point" : isEndBoard ? 'left-radius' : ""}>{isImportant ? "중요" : rowNumInt}</td>
                //             <td>{category_name}</td>
                //             <td className="content">{title}</td>
                //             <td className={isImportant ? "point" : ""}>{attach_cnt}개</td>
                //             <td className={isEndBoard ? 'right-radius' : ""}>{insert_date.substring(0, 10)}</td>
                //         </tr>
                //     )
                // })
            }
            {/* {!!!total_cnt && <tr><td colSpan={TABLE_COLUMN_INFO.width.length}>No Data</td></tr>} */}
            <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >No Data</td></tr>
        </>
    )
};