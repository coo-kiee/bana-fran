import { FC, Suspense, useCallback, useEffect } from "react";

// Type
import { CALCULATE_STATUS, CalculateChargeMultiplyKey, CALCULATE_CHARGE_MULTIPLY, CalculateLastMonthTotalQueryResult, CalculateLastMonthOutput } from "types/calculate/calculateType";

// API
import CALCULATE_SERVICE from 'service/calculateService';

// Utils
import Utils from "utils/Utils";

// Component
import { ErrorBoundary } from "react-error-boundary";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import NoData from "pages/common/noData";
import CalculateTableHeader from "../component/CalculateTableHeader";

interface CalculateListTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
    searchDate: string,
    setOutput: React.Dispatch<React.SetStateAction<Pick<CalculateLastMonthTotalQueryResult, "sumAll"> & Omit<CalculateLastMonthOutput, "error_msg">>>,
    setListRefetchFn?: React.Dispatch<React.SetStateAction<() => Promise<void>>>
    tableRef: React.MutableRefObject<HTMLTableElement | null>,
};
const CalculateListTable: FC<CalculateListTableProps> = ({ userInfo, searchDate, setOutput, setListRefetchFn, tableRef }) => {

    // 사용자 정보
    const { f_code, staff_no } = userInfo;

    const { width, thInfo } = CALCULATE_LIST_TABLE_COLUMN_INFO;

    return (
        <>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <CalculateTableHeader width={width} thInfo={thInfo} />
                <tbody>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => setOutput(prev => ({ ...prev, calculateStatus: -1, sumAll: 0 }))}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={-68} isTable={true} />}>
                            <TableList fCode={f_code} staffNo={staff_no} searchDate={searchDate} setOutput={setOutput} setListRefetchFn={setListRefetchFn} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
        </>
    );
}




interface TableListProps {
    fCode: number,
    staffNo: number,
    searchDate: string,
    setOutput?: React.Dispatch<React.SetStateAction<Pick<CalculateLastMonthTotalQueryResult, "sumAll"> & Omit<CalculateLastMonthOutput, "error_msg">>>,
    setListRefetchFn?: React.Dispatch<React.SetStateAction<() => Promise<void>>>,
    isPDF?: boolean,
};
export const TableList: FC<TableListProps> = ({ fCode, staffNo, searchDate, setOutput, setListRefetchFn, isPDF = false }) => {

    // 데이터 가져오기 - isPDF true면 X
    const { data: calculateLastMonthTotalQueryResult, refetch: listRefetchFn } = CALCULATE_SERVICE.useCalculateLastMonthTotal(fCode, staffNo, searchDate, isPDF);

    // 데이터 가공
    const { list: calculateDetailList, out: outputData, sumAll } = calculateLastMonthTotalQueryResult || {};
    const { calculate_status, calculate_id, error_msg } = outputData || {};

    // 상위 컴포넌트 outPut Data 갱신
    useEffect(() => {
        if (calculate_id && calculate_status && sumAll) setOutput && setOutput(prev => ({ ...prev, sumAll, calculate_status: calculate_status, calculate_id: calculate_id }));
        else setOutput && setOutput(prev => ({ ...prev, sumAll: 0, calculate_status: CALCULATE_STATUS.ERROR, calculate_id: 0 }));
    }, [sumAll, calculate_status, calculate_id, setOutput]);

    // 정산내역 데이터 다시 불러오기
    const handleListRefetch = useCallback(async () => {
        await listRefetchFn();
    }, [listRefetchFn]);

    // 정산확인 후 refetch 하기위해서 초기 렌더링시 상위 컴포넌트 refetch state 갱신
    useEffect(() => {
        if (setListRefetchFn) setListRefetchFn(prev => handleListRefetch);
    }, [setListRefetchFn, handleListRefetch]);

    return (
        <>
            {
                calculateDetailList?.map(caculateData => {
                    const { from_date, to_date, calculate_type, item_type, item_detail, item_cnt, item_price, supply_amt, vat_amt, total_amt, etc, calculate_d_id } = caculateData;

                    const calculateType: CalculateChargeMultiplyKey = calculate_type as CalculateChargeMultiplyKey;
                    const supplyAmt = supply_amt * CALCULATE_CHARGE_MULTIPLY[calculateType];
                    const vatAmt = vat_amt * CALCULATE_CHARGE_MULTIPLY[calculateType];
                    const totalAmt = total_amt * CALCULATE_CHARGE_MULTIPLY[calculateType];

                    return (
                        <tr key={calculate_d_id}>
                            <td>{`${from_date}~${to_date}`}</td>
                            <td>{calculate_type}</td>
                            <td>{item_type}</td>
                            <td>{item_detail}</td>
                            <td>{Utils.numberComma(item_cnt)}</td>
                            <td>{Utils.numberComma(item_price)}</td>
                            <td className="align-right">{Utils.numberComma(supplyAmt)}</td>
                            <td className="align-right">{Utils.numberComma(vatAmt)}</td>
                            <td className="align-right"><strong>{Utils.numberComma(totalAmt)}</strong></td>
                            <td>{etc}</td>
                        </tr>
                    )
                })
            }
            {calculate_status === CALCULATE_STATUS.DISTRIBUTE && <tr><td className="no-data" rowSpan={10} colSpan={CALCULATE_LIST_TABLE_COLUMN_INFO.width.length} >{error_msg}</td></tr>}
            {calculate_status !== CALCULATE_STATUS.DISTRIBUTE && !!!calculateDetailList?.length && <NoData isTable={true} />}
        </>
    )
};

// Component Type
export const CALCULATE_LIST_TABLE_COLUMN_INFO = {
    width: ['188', '70', '130', '*', '130', '130', '130', '130', '130', '130'],
    thInfo: [
        { text: '정산기간' },
        { text: '구분' },
        { text: '품목' },
        { text: '상세내역' },
        { text: '수량' },
        { text: '단가' },
        { text: '공급가액' },
        { text: '부가세' },
        { text: '합계' },
        { text: '비고' },
    ],
} as const;

export default CalculateListTable;