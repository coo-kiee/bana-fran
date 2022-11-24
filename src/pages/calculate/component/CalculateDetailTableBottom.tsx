// Util
import Utils from "utils/Utils";

// Component
import Pagination from "pages/common/pagination";

interface CalculateDetailTableBottomProps<T> {
    fCodeName: string,
    titleFrom: string,
    titleTo: string,
    colspan: T,
    tableRef: React.MutableRefObject<HTMLTableElement | null>,
    pageInfo: {
        dataCnt: number;
        currentPage: number;
        row: number;
    },
    setPageInfo: React.Dispatch<React.SetStateAction<{
        dataCnt: number;
        currentPage: number;
        row: number;
    }>>,
    excelFileName: string,
};

const CalculateDetailTableBottom = <T extends unknown>({ fCodeName, titleFrom, titleTo, colspan, tableRef, pageInfo, setPageInfo, excelFileName }: CalculateDetailTableBottomProps<T>) => {

    const { dataCnt = 1, currentPage = 1, row = 50 } = pageInfo;
    const handlePageChange = (changePage: number) => {
        setPageInfo(prev => ({ ...prev, currentPage: changePage }));
    };

    const handlePageRow = (row: number) => {
        setPageInfo(prev => ({ ...prev, row, currentPage: 1 }));
    };

    const excelDownload = () => {
        if (tableRef.current) {
            // Excel - sheet options: 셀 시작 위치, 셀 크기
            const options = {
                type: 'table', // 필수 O
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: (colspan as []).map(wpx => ((wpx !== '*' ? { wpx: Number(wpx) * 1.2 } : { wpx: 400 }))), // 셀 너비 설정, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
                // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
                sheetName: '', // 시트이름, 필수 X
            };

            const fileName = `${fCodeName}_${excelFileName}(${titleFrom}~${titleTo})`;

            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };

    return (
        <>
            {
                !!dataCnt &&
                <>
                    <div className="result-function-wrap" >
                        <div className="function">
                            <button className="goast-btn" onClick={excelDownload}>엑셀다운</button>
                        </div>
                        <Pagination dataCnt={dataCnt} handlePageChange={handlePageChange} handlePageRow={handlePageRow} pageInfo={{ currentPage, row }} />
                    </div>
                </>
            }
        </>
    )
};

export default CalculateDetailTableBottom;