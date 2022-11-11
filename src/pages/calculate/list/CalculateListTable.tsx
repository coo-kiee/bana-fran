import { FC, Suspense, useEffect, useRef, useState } from "react";

// DatePicker
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";

// Type
import { CalculateDetail, CalculateDetailOut, CalculateStatusType, CALCULATE_STATUS } from "types/calculate/calculateType";

// Service
import CALCULATE_SERVICE from 'service/calculateService';

// Utils
import Utils from "utils/Utils";

// Component
import { ErrorBoundary } from "react-error-boundary";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

interface CalculateListTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
    outPut: {
        sumAll: number;
        calculateStatus: CalculateStatusType;
        calculateId: number;
    },
    handlePopup: (key: string, value: boolean) => void,
    setOutput: React.Dispatch<React.SetStateAction<{
        sumAll: number;
        calculateStatus: CalculateStatusType;
        calculateId: number;
    }>>,
    setIsPDF: React.Dispatch<React.SetStateAction<boolean>>,
    isPDF?: boolean,
};
const CalculateListTable: FC<CalculateListTableProps> = ({ outPut, userInfo, handlePopup, setOutput, isPDF, setIsPDF }) => {
    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;
    // Output
    const { sumAll, calculateStatus, calculateId } = outPut;

    // 정산 데이터
    const initialDate = new Date();
    initialDate.setMonth(initialDate.getMonth() - 1);
    const [searchDate, setSearchDate] = useState(new Date(initialDate));
    const stdMonth = (Utils.converDateFormat(searchDate, '-') as string).substring(0, 7);
    const listQuerykey = ['caculateDetailList', JSON.stringify({ f_code, staff_no, stdMonth })];

    // Table
    const tableRef = useRef<null | HTMLTableElement>(null);
    const { width, headerText } = TABLE_COLUMN_INFO;

    // PDF 다운
    const pdfRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        if (isPDF && pdfRef.current) {

            const pdfDownload = async () => {
                const fileName = `${stdMonth.replace('-', '년_')}월_${f_code_name}_정산내역`;
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
    // eslint-disable-next-line
    }, []);

    return (
        <div ref={pdfRef}>
            {isPDF && <div style={{ textAlign: 'center', fontSize: '30px', marginBottom: '30px' }}><span style={{ fontWeight: 'bold', color: '#f1658a' }}>{stdMonth.replace('-', '년 ')}월</span> {f_code_name} 정산내역 확인</div>}
            {!isPDF && <TableTop listQuerykey={listQuerykey} caculateStatus={calculateStatus} calculateId={calculateId} staffNo={staff_no} initialDate={initialDate} searchDate={searchDate} handlePopup={handlePopup} setSearchDate={setSearchDate} />}
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                {/* Column Width */}
                <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                <tbody>
                    {/* Table Header  */}
                    <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                    {/* List */}
                    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <CustomErrorComponent resetErrorBoundary={resetErrorBoundary} colsPan={TABLE_COLUMN_INFO.width.length} />} onError={(e) => setOutput(prev => ({ ...prev, calculateStatus: -1, sumAll: 0 }))}>
                        <Suspense fallback={<tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} style={{ background: '#fff' }}><Loading height={80} width={80} marginTop={-50} /></td></tr>}>
                            <TableList listQuerykey={listQuerykey} fCode={f_code} staffNo={staff_no} stdMonth={stdMonth} setOutput={setOutput} />
                        </Suspense>
                    </ErrorBoundary>
                </tbody>
            </table>
            < TableBottom sumAll={sumAll} tableRef={tableRef} searchDate={searchDate} fCodeName={f_code_name} isPDF={isPDF} setIsPDF={setIsPDF} />
        </div>
    );
}

export default CalculateListTable;




const TABLE_COLUMN_INFO = {
    width: ['188', '70', '130', '*', '130', '130', '130', '130', '130', '130'],
    headerText: ['정산기간', '구분', '품목', '상세내역', '수량', '단가', '공급가액', '부가세', '합계', '비고'],
} as const;



interface TableTopProps {
    listQuerykey: string[],
    calculateId: number
    caculateStatus: CalculateStatusType,
    staffNo: number
    initialDate: Date,
    searchDate: Date,
    handlePopup: (key: string, value: boolean) => void,
    setSearchDate: React.Dispatch<React.SetStateAction<Date>>,
};
const TableTop: FC<TableTopProps> = ({ listQuerykey, calculateId, caculateStatus, staffNo, initialDate, searchDate, handlePopup, setSearchDate }) => {

    const isError = caculateStatus === CALCULATE_STATUS.ERROR;
    const isInactive = !caculateStatus || caculateStatus === CALCULATE_STATUS.CONFIRM || isError;
    const confirmList = CALCULATE_SERVICE.useCalculateConfirmList(staffNo, calculateId, listQuerykey);

    return (
        <>
            {
                <div className="function-wrap">
                    <div className="select-wrap">
                        <div className="search-wrap">
                            <div className="input-wrap">
                                <ReactDatePicker
                                    dateFormat={'yyyy-MM'}
                                    selected={searchDate}
                                    onChange={(date) => setSearchDate(prev => date as Date)}
                                    maxDate={initialDate}
                                    showMonthYearPicker={true}
                                    locale={ko}
                                />
                            </div>
                            <button className="goast-btn">선택</button>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <button className={`btn-check ${isInactive ? 'inactive' : ''}`} onClick={isInactive ? undefined : confirmList} >정산확인</button>
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
    listQuerykey: string[],
    fCode: number,
    staffNo: number,
    stdMonth: string,
    setOutput: React.Dispatch<React.SetStateAction<{
        sumAll: number;
        calculateStatus: CalculateStatusType;
        calculateId: number;
    }>>,
};
const TableList: FC<TableListProps> = ({ listQuerykey, fCode, staffNo, stdMonth, setOutput }) => {

    const { data } = CALCULATE_SERVICE.useCalculateDetailList(listQuerykey, fCode, staffNo, stdMonth);

    const caculateList = data?.list as CalculateDetail[];
    const { calculate_status, calculate_id, error_msg } = data?.out as CalculateDetailOut;
    const sumAll = data?.sumAll as number;

    useEffect(() => {
        if (calculate_id && calculate_status && sumAll) setOutput(prev => ({ ...prev, sumAll, calculateStatus: calculate_status, calculateId: calculate_id }));
        else setOutput(prev => ({ ...prev, sumAll: 0, calculateStatus: CALCULATE_STATUS.ERROR, calculateId: 0 }));
    }, [sumAll, calculate_status, calculate_id, setOutput]);

    return (
        <>
            {
                calculate_status && calculate_status !== CALCULATE_STATUS.DISTRIBUTE &&
                caculateList.map(caculateData => {
                    const { from_date, to_date, calculate_type, item_type, item_detail, item_cnt, item_price, supply_amt, vat_amt, total_amt, etc, calculate_d_id } = caculateData;
                    return (
                        <tr key={calculate_d_id}>
                            <td>{`${from_date}~${to_date}`}</td>
                            <td>{calculate_type}</td>
                            <td>{item_type}</td>
                            <td>{item_detail}</td>
                            <td>{Utils.numberComma(item_cnt)}</td>
                            <td>{Utils.numberComma(item_price)}</td>
                            <td className="align-right">{Utils.numberComma(supply_amt)}</td>
                            <td className="align-right">{Utils.numberComma(vat_amt)}</td>
                            <td className="align-right"><strong>{Utils.numberComma(total_amt)}</strong></td>
                            <td>{etc}</td>
                        </tr>
                    )
                })
            }
            {calculate_status && calculate_status === CALCULATE_STATUS.DISTRIBUTE && <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >{error_msg}</td></tr>}
            {!calculate_status && <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >No Data</td></tr>}
        </>
    )
};

interface TableBottomProps {
    sumAll: number,
    tableRef: React.MutableRefObject<HTMLTableElement | null>,
    searchDate: Date,
    fCodeName: string,
    isPDF?: boolean,
    setIsPDF: React.Dispatch<React.SetStateAction<boolean>>,
};
const TableBottom: FC<TableBottomProps> = ({ sumAll, tableRef, searchDate, fCodeName, isPDF, setIsPDF }) => {

    const excelDownload = () => {
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                // sheetOption: { origin: "B3", outline: { above: true } }, // 해당 셀부터 데이터 표시, 세부정보 아래 요약행, 필수 X
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: TABLE_COLUMN_INFO.width.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
                // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
                sheetName: '', // 시트이름, 필수 X
            };

            const fileName = `${(Utils.converDateFormat(searchDate, '-') as string).substring(0, 7)}_${fCodeName}_정산내역_확인`;

            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };

    return (
        <>
            {sumAll > 0 &&
                <div className="result-function-wrap" >
                    <div className="function">
                        {
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
}

export const CustomErrorComponent: FC<{ resetErrorBoundary: () => void, colsPan: number }> = ({ resetErrorBoundary, colsPan }) => {

    return (
        <tr>
            <td rowSpan={10} colSpan={colsPan} style={{ paddingTop: '30px' }}>
                <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />
            </td>
        </tr>
    );
};