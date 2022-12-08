import { FC } from "react";

// Util
import Utils from "utils/Utils";

// Type
import { CalculateStatusType, CALCULATE_STATUS } from "types/calculate/calculateType";
import { CALCULATE_LIST_TABLE_COLUMN_INFO } from "./CalculateListTable";

interface CalculateListTableBottonProps {
    calculateStatus: CalculateStatusType,
    sumAll: number | undefined,
    tableRef?: React.MutableRefObject<HTMLTableElement | null>,
    searchDate: string,
    fCodeName: string,
    isPDF?: boolean,
    setIsPDF: React.Dispatch<React.SetStateAction<boolean>>,
};
const CalculateListTableBotton: FC<CalculateListTableBottonProps> = ({ calculateStatus, sumAll, tableRef, searchDate, fCodeName, isPDF = false, setIsPDF }) => {

    const excelDownload = () => {
        if (tableRef?.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: CALCULATE_LIST_TABLE_COLUMN_INFO.width.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
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
 
export default CalculateListTableBotton;