import { FC, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// API
import CALCULATE_SERVICE from "service/calculateService";

// Type
import { CalculateType, CALCULATE_TYPE } from "types/calculate/calculateType";

// Util
import Utils from "utils/Utils";

// Component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

interface CalculateLastMonthTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
    caculateType: CalculateType,
};
const CalculateLastMonthTable: FC<CalculateLastMonthTableProps> = ({ userInfo, caculateType }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    const now = new Date();
    const year = now.getFullYear();
    const lastMonth = now.getMonth();

    const { width, headerText } = TABLE_COLUMN_INFO[caculateType as keyof typeof TABLE_COLUMN_INFO];

    return (
        <>
            <p className="title bullet">{year}년 {lastMonth}월 기타 정산 내역</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail')}>
                        <Suspense fallback={<tr><td className="no-data" rowSpan={10} colSpan={width.length} style={{ background: '#fff' }}><Loading height={80} width={80} marginTop={-50} /></td></tr>}>
                            <TableList fCode={f_code} staffNo={staff_no} colSpan={width.length} caculateType={caculateType} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
        </>
    );
}

export default CalculateLastMonthTable;




const TABLE_COLUMN_INFO = {
    [CALCULATE_TYPE.POINT]: {
        width: ['218', '*', '130', '130', '130'],
        headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
    },
    [CALCULATE_TYPE.COUPON]: {
        width: ['218', '*', '130', '130', '130'],
        headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
    },
    [CALCULATE_TYPE.CLAIM]: {
        width: ['218', '*', '130', '130', '130'],
        headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
    },
    [CALCULATE_TYPE.ETC]: {
        width: ['188', '70', '*', '130', '130', '130'],
        headerText: ['정산기간', '구분', '품목', '공급가액', '부가세', '합계'],
    },
} as const;

interface TableListProps {
    fCode: number,
    staffNo: number,
    colSpan: number,
    caculateType: CalculateType,
};
const TableList: FC<TableListProps> = ({ fCode, staffNo, colSpan, caculateType }) => {

    const { data: calculateDetailSumList } = CALCULATE_SERVICE.useCalculateDetailSum(['calculateDetailSum', JSON.stringify({ fCode, staffNo, caculateType })], fCode, staffNo, caculateType);

    return (
        <>
            {
                calculateDetailSumList?.map((calculateDetailSum, index) => {
                    const { from_date, to_date, calculate_type, item_name, supply_amt, vat_amt, total_amt } = calculateDetailSum;

                    return (
                        <tr key={index}>
                            <td className="align-center">{`${from_date}~${to_date}`}</td>
                            {calculate_type && <td className="align-center">{calculate_type}</td>}
                            <td className="align-left">{item_name}</td>
                            <td className="align-right">{Utils.numberComma(supply_amt)}</td>
                            <td className="align-right">{Utils.numberComma(vat_amt)}</td>
                            <td className="align-right">{Utils.numberComma(total_amt)}</td>
                        </tr>
                    )
                })
            }
            {calculateDetailSumList?.length === 0 && <tr><td className="no-data" rowSpan={10} colSpan={colSpan} >No Data</td></tr>}
        </>
    )
};