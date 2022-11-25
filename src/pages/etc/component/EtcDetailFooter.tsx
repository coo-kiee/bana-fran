import { FC, forwardRef } from 'react';
import Utils from 'utils/Utils';

// component
import Pagination from 'pages/common/pagination';

// type
import { PageInfoType } from "types/etc/etcType";
import React from 'react';

interface EtcDetailFooterProps {
    dataCnt: number, // 데이터 총 갯수
    pageInfo: PageInfoType, // 페이지 state 
    pageFn: React.Dispatch<React.SetStateAction<PageInfoType>> // 페이지 setState
    tableRef: React.MutableRefObject<HTMLTableElement | null>, // 엑셀로 만들 테이블 ref
    detailTableColGroup: string[], // tableHead
    fCodeName: string, // '충무로점'
    searchDate: string, // '2022-11-01 ~ 2022-11-02'
    excelFileName: string, // '딜리버리 수수료 내역'
}

// TODO: 엑셀 다운, 페이지네이션, 정렬 관련 (.result-function-wrap 부분)
const EtcDetailFooter: FC<EtcDetailFooterProps> = (props) => {
    console.log(`EtcDetailFooter`)
    const { pageFn, dataCnt, pageInfo, tableRef, detailTableColGroup, fCodeName, searchDate, excelFileName } = props;

    const handleExcelDownload = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${searchDate}_${fCodeName}_${excelFileName}`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };

    const handlePageChange = (changePage: number) => {
        pageFn((prevPageInfo) => ({ ...prevPageInfo, currentPage: changePage }))
    }
    const handlePageRow = (row: number) => {
        pageFn((prevPageInfo) => ({ ...prevPageInfo, row: row }))
    }

    return (
        <div className="result-function-wrap">
            <div className="function">
                <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
            </div>
            <Pagination dataCnt={dataCnt} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
        </div>
    )
}

export default EtcDetailFooter;