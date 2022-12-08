import { FC, useEffect, useRef } from "react";

// Type
import { CalculateLastMonthOutput, CalculateLastMonthTotalQueryResult } from "types/calculate/calculateType";

// Util
import Utils from "utils/Utils";

// Component
import Loading from "pages/common/loading";
import CalculateTableHeader from "../component/CalculateTableHeader";
import CalculateListTableBotton from "./CalculateListTableBotton";
import { CALCULATE_LIST_TABLE_COLUMN_INFO, TableList } from "./CalculateListTable";

interface PDFCalculateListTableProps {
    userInfo: {
        f_code: number,
        f_code_name: string,
        staff_no: number
    },
    outPut: Pick<CalculateLastMonthTotalQueryResult, 'sumAll'> & Omit<CalculateLastMonthOutput, 'error_msg'>,
    searchDate: string,
    isPDF: boolean,
    setIsPDF: React.Dispatch<React.SetStateAction<boolean>>,
};
const PDFCalculateListTable: FC<PDFCalculateListTableProps> = ({ userInfo, searchDate, outPut, isPDF, setIsPDF }) => {

    // 사용자 정보
    const { f_code, staff_no, f_code_name } = userInfo;

    // Output
    const { sumAll, calculate_status } = outPut;

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

    const { width, thInfo } = CALCULATE_LIST_TABLE_COLUMN_INFO;

    return (
        <>
            <div style={{ position: 'absolute', zIndex: 100, width: '100%', maxWidth: '2270px', top: '50%', display: 'flex' }}><Loading /></div>
            <div style={{ opacity: 0, width: '2270px' }}>
                <div ref={pdfRef}>
                    <div style={{ textAlign: 'center', fontSize: '30px', marginBottom: '30px' }}><span style={{ fontWeight: 'bold', color: '#f1658a' }}>{searchDate.replace('-', '년 ')}월</span> {f_code_name} 정산내역 확인</div>
                    <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                        <CalculateTableHeader width={width} thInfo={thInfo} />
                        <tbody>
                            <TableList fCode={f_code} staffNo={staff_no} isPDF={isPDF} searchDate={searchDate} />
                        </tbody>
                    </table>
                    <CalculateListTableBotton calculateStatus={calculate_status} sumAll={sumAll} searchDate={searchDate} fCodeName={f_code_name} isPDF={isPDF} setIsPDF={setIsPDF} />
                </div>
            </div>
        </>
    );
}

export default PDFCalculateListTable;