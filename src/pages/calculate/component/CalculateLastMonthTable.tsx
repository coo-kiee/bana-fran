import { FC, ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// API
import CALCULATE_SERVICE from "service/calculateService";

// Type
import { CalculateType, CALCULATE_TYPE, ETC_TYPE } from "types/calculate/calculateType";

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
    const { f_code, staff_no } = userInfo;

    const now = new Date();
    const year = now.getFullYear();
    const lastMonth = now.getMonth();

    const { width, headerText } = TABLE_COLUMN_INFO[caculateType as keyof typeof TABLE_COLUMN_INFO];

    return (
        <>
            <p className="title bullet">{year}년 {lastMonth}월 {TABLE_COLUMN_INFO[caculateType as keyof typeof TABLE_COLUMN_INFO].title}</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => console.log('CouponDetail')}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
                            <TableList fCode={f_code} staffNo={staff_no} colSpan={width.length} caculateType={caculateType} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
        </>
    );
}

export default CalculateLastMonthTable;




interface TableListProps {
    fCode: number,
    staffNo: number,
    colSpan: number,
    caculateType: CalculateType,
};
const TableList: FC<TableListProps> = ({ fCode, staffNo, colSpan, caculateType }) => {

    const { data: calculateDetailSumList } = CALCULATE_SERVICE.useCalculateDetailSum(['calculateDetailSum', JSON.stringify({ fCode, staffNo, caculateType })], fCode, staffNo, caculateType);
    const totalInfo = (caculateType === CALCULATE_TYPE.ETC) ? { text: '합계', colSpan: 2, supply: 0, vat: 0, total: 0, } : {};
    
    return (
        <>
            {
                calculateDetailSumList?.reduce((res, calculateDetailSum, index, arr) => {
                    const { from_date, to_date, calculate_type, item_name, supply_amt, vat_amt, total_amt } = calculateDetailSum;

                    // 기타 정산 내역 - 청구 금액인 경우 음수, 그 외 정산 내역은 양수 처리
                    const multiply = calculate_type && calculate_type === ETC_TYPE.BILLING ? -1 : 1;
                    const supplyAmt = supply_amt * multiply;
                    const vatAmt = vat_amt * multiply;
                    const totalAmt = total_amt * multiply;

                    // 기타 정산 내역 합계 계산
                    if(calculate_type && totalInfo.text) {
                        totalInfo.supply += supplyAmt;
                        totalInfo.vat += vatAmt;
                        totalInfo.total += totalAmt;
                    };

                    res.push(
                        <tr key={index}>
                            <td className="align-center">{`${from_date}~${to_date}`}</td>
                            {calculate_type && <td className="align-center">{calculate_type}</td>}
                            <td className="align-left">{item_name}</td>
                            <td className="align-right">{Utils.numberComma(supplyAmt)}</td>
                            <td className="align-right">{Utils.numberComma(vatAmt)}</td>
                            <td className="align-right">{Utils.numberComma(totalAmt)}</td>
                        </tr>
                    );

                    // 기타 정산 내역 합계 Row 추가
                    if (calculate_type && index === arr.length - 1) {
                        res.push(
                            <tr key={index + 1}>
                                <td className="align-center">{`${from_date}~${to_date}`}</td>
                                <td className="align-center" colSpan={totalInfo.colSpan}>{totalInfo.text}</td>
                                <td className="align-right">{Utils.numberComma(totalInfo.supply)}</td>
                                <td className="align-right">{Utils.numberComma(totalInfo.vat)}</td>
                                <td className="align-right">{Utils.numberComma(totalInfo.total)}</td>
                            </tr>
                        );
                    };
                    return res;
                }, [] as ReactNode[])
            }
            {calculateDetailSumList?.length === 0 && <tr><td className="no-data" rowSpan={10} colSpan={colSpan} >No Data</td></tr>}
        </>
    )
};

// Component Type
const TABLE_COLUMN_INFO = {
    [CALCULATE_TYPE.POINT]: {
        title: '유상포인트 결제내역',
        width: ['218', '*', '130', '130', '130'],
        headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
    },
    [CALCULATE_TYPE.COUPON]: {
        title: '본사 쿠폰 결제 내역',
        width: ['218', '*', '130', '130', '130'],
        headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
    },
    [CALCULATE_TYPE.CLAIM]: {
        title: '클레임 보상 내역',
        width: ['218', '*', '130', '130', '130'],
        headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
    },
    [CALCULATE_TYPE.ETC]: {
        title: '기타 정산 내역',
        width: ['188', '70', '*', '130', '130', '130'],
        headerText: ['정산기간', '구분', '품목', '공급가액', '부가세', '합계'],
    },
} as const;