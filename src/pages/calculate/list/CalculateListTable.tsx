import { FC, Suspense, useCallback, useEffect, useRef } from "react";

// Type
import { CalculateStatusType, CALCULATE_STATUS, CalculateChargeMultiplyKey, CALCULATE_CHARGE_MULTIPLY } from "types/calculate/calculateType";
import { Output } from ".";

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
    setSearchDate: React.Dispatch<React.SetStateAction<string>>,
    outPut: Output,
    handlePopup: (key: string, value: boolean) => void,
    setOutput: React.Dispatch<React.SetStateAction<Output>>,
    listRefetchFn?: () => Promise<void>
    setListRefetchFn?: React.Dispatch<React.SetStateAction<() => Promise<void>>>
    isPDF?: boolean,
    setIsPDF: React.Dispatch<React.SetStateAction<boolean>>,
};
const CalculateListTable: FC<CalculateListTableProps> = ({ outPut, userInfo, searchDate, setSearchDate, handlePopup, setOutput, isPDF, setIsPDF, listRefetchFn, setListRefetchFn }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // Output
    const { sumAll, calculateStatus } = outPut;

    // Table
    const tableRef = useRef<null | HTMLTableElement>(null);
    const { width, thInfo } = TABLE_COLUMN_INFO;

    // PDF 다운
    const pdfRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        if (isPDF && pdfRef.current) {

            const pdfDownload = async () => {
                const fileName = `${f_code_name}_정산내역 확인(${searchDate})`;
                const element = pdfRef.current as HTMLDivElement;
                await Utils.downloadPdf({ element, fileName, pdfInfo: { orientation: 'landscape' }, imgInfo: { pageWidth: 297, pageHeight: 210 } });
                setIsPDF(prev => false);
            };

            const prevScroll = document.body.style.overflowY; // 현재 스크롤 상태 저장
            document.body.style.overflowY = 'hidden'; // 다운로드 중 스크롤 이동 방지

            pdfDownload();

            return () => {
                document.body.style.overflowY = prevScroll; // 스크롤 상태 원상복귀
            };
        }
    }, [f_code_name, searchDate, isPDF, setIsPDF]);

    return (
        <div ref={pdfRef}>
            {isPDF && <div style={{ textAlign: 'center', fontSize: '30px', marginBottom: '30px' }}><span style={{ fontWeight: 'bold', color: '#f1658a' }}>{searchDate.replace('-', '년 ')}월</span> {f_code_name} 정산내역 확인</div>}
            {!isPDF && <TableTop listRefetchFn={listRefetchFn} calculateStatus={calculateStatus} fCode={f_code} staffNo={staff_no} searchDate={searchDate} handlePopup={handlePopup} setSearchDate={setSearchDate} />}
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <CalculateTableHeader width={width} thInfo={thInfo} />
                <tbody>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />} onError={(e) => setOutput(prev => ({ ...prev, calculateStatus: -1, sumAll: undefined }))}>
                        <Suspense fallback={<Loading height={80} width={80} marginTop={-68} isTable={true} />}>
                            <TableList fCode={f_code} staffNo={staff_no} isPDF={isPDF} searchDate={searchDate} setOutput={setOutput} setListRefetchFn={setListRefetchFn} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            < TableBottom calculateStatus={calculateStatus} sumAll={sumAll} tableRef={tableRef} searchDate={searchDate} fCodeName={f_code_name} isPDF={isPDF} setIsPDF={setIsPDF} />
        </div>
    );
}

export default CalculateListTable;




interface TableTopProps {
    listRefetchFn: (() => Promise<void>) | undefined,
    calculateStatus: CalculateStatusType,
    fCode: number,
    staffNo: number,
    searchDate: string,
    handlePopup: (key: string, value: boolean) => void,
    setSearchDate: React.Dispatch<React.SetStateAction<string>>,
};
const TableTop: FC<TableTopProps> = ({ listRefetchFn, calculateStatus, fCode, staffNo, searchDate, handlePopup, setSearchDate }) => {

    const isError = calculateStatus === CALCULATE_STATUS.ERROR;
    const isInactive = !calculateStatus || calculateStatus === CALCULATE_STATUS.CONFIRM || isError;
    const { data: monthList } = CALCULATE_SERVICE.useCalculateMonthList(fCode, staffNo);

    return (
        <>
            {
                <div className="function-wrap">
                    <div className="select-wrap">
                        <div className="search-wrap">
                            <select name="" id="" value={searchDate} onChange={(e) => setSearchDate(prev => e.target.value)}>
                                {monthList?.map((item, index) => <option key={index} value={item.std_month}>{item.std_month}</option>)}
                                {monthList?.length === 0 && <option value={searchDate}>{searchDate}</option>}
                            </select>
                            <button className="goast-btn" onClick={() => listRefetchFn && listRefetchFn()}>선택</button>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <button className={`btn-check ${isInactive ? 'inactive' : ''}`} onClick={isInactive ? undefined : () => handlePopup('calculateConfirm', true)} >정산확인</button>
                        <button className={`btn-modify-request modify-view ${isInactive ? 'inactive' : ''}`} onClick={isInactive ? undefined : () => handlePopup('requestModify', true)} >수정요청</button>
                        <button className={`btn-modify-history history-view ${isError ? 'inactive' : ''}`} onClick={isError ? undefined : () => handlePopup('changeHistory', true)} >수정요청/변경이력</button>
                    </div>
                    <p className="title">
                        <span className="sub-title hyphen">'보전'은 본사로부터 보전받을 금액이며, '청구'는 본사가 가맹점에 청구하는 금액을 의미합니다.</span>
                    </p>
                </div>
            }
        </>
    )
};

interface TableListProps {
    fCode: number,
    staffNo: number,
    searchDate: string,
    setOutput: React.Dispatch<React.SetStateAction<Output>>,
    setListRefetchFn: React.Dispatch<React.SetStateAction<() => Promise<void>>> | undefined,
    isPDF?: boolean,
};
const TableList: FC<TableListProps> = ({ fCode, staffNo, searchDate, setOutput, setListRefetchFn, isPDF = false }) => {

    // 데이터 가져오기 - isPDF true면 X
    const { data: calculateLastMonthTotalQueryResult, refetch: listRefetchFn } = CALCULATE_SERVICE.useCalculateLastMonthTotal(fCode, staffNo, searchDate, isPDF);

    // 데이터 가공
    const { list: calculateDetailList, out: outputData, sumAll } = calculateLastMonthTotalQueryResult || {};
    const { calculate_status, calculate_id, error_msg } = outputData || {};

    // 상위 컴포넌트 outPut Data 갱신
    useEffect(() => {
        if (calculate_id && calculate_status && sumAll) setOutput(prev => ({ ...prev, sumAll, calculateStatus: calculate_status, calculateId: calculate_id }));
        else setOutput(prev => ({ ...prev, sumAll: 0, calculateStatus: CALCULATE_STATUS.ERROR, calculateId: 0 }));
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
            {calculate_status === CALCULATE_STATUS.DISTRIBUTE && <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >{error_msg}</td></tr>}
            {calculate_status !== CALCULATE_STATUS.DISTRIBUTE && !!!calculateDetailList?.length && <NoData isTable={true} />}
        </>
    )
};

interface TableBottomProps {
    calculateStatus: CalculateStatusType,
    sumAll: number | undefined,
    tableRef: React.MutableRefObject<HTMLTableElement | null>,
    searchDate: string,
    fCodeName: string,
    isPDF?: boolean,
    setIsPDF: React.Dispatch<React.SetStateAction<boolean>>,
};
const TableBottom: FC<TableBottomProps> = ({ calculateStatus, sumAll, tableRef, searchDate, fCodeName, isPDF, setIsPDF }) => {

    const excelDownload = () => {
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: TABLE_COLUMN_INFO.width.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
                // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
                sheetName: '', // 시트이름, 필수 X
            };

            const fileName = `${fCodeName}_정산내역 확인(${searchDate})`;

            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };

    return (
        <>
            {calculateStatus !== CALCULATE_STATUS.ERROR && calculateStatus !== CALCULATE_STATUS.DISTRIBUTE &&
                <div className="result-function-wrap" >
                    <div className="function">
                        {   // PDF 다운로드 일때는 버튼 안보이기
                            !isPDF &&
                            <>
                                <button className="goast-btn" onClick={excelDownload}>엑셀다운</button>&nbsp;
                                <button className="goast-btn" onClick={() => setIsPDF(prev => true)}>인쇄</button>
                            </>
                        }
                    </div>
                    <div className="result">
                        합계 :<span>{Utils.numberComma(sumAll)}</span>
                    </div>
                </div>
            }
        </>
    )
};

// Component Type
const TABLE_COLUMN_INFO = {
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