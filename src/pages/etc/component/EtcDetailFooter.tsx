// component
import Pagination from 'pages/common/pagination';

// type
import { PageInfoType } from "types/etc/etcType";

interface EtcDetailFooterProps {
    excelFn: () => void, // 엑셀 다운로드 함수  
    dataCnt: number, // 데이터 총 갯수
    pageInfo: PageInfoType, // 페이지
    boundaryRange?: number, // 화면에 노출되는 페이지 번호 갯수
    pageFn: React.Dispatch<React.SetStateAction<PageInfoType>>
}

// TODO: 엑셀 다운, 페이지네이션, 정렬 관련 (.result-function-wrap 부분)
const EtcDetailFooter: React.FC<EtcDetailFooterProps> = (props) => {
    const { excelFn, pageFn, dataCnt, pageInfo } = props;

    const handlePageChange = (changePage: number) => {
        pageFn((prevPageInfo) => ({ ...prevPageInfo, currentPage: changePage }))
    }
    const handlePageRow = (row: number) => {
        pageFn((prevPageInfo) => ({ ...prevPageInfo, row: row }))
    }
    return (
        <div className="result-function-wrap">
            <div className="function">
                <button className="goast-btn" onClick={excelFn}>엑셀다운</button>
            </div>
            <Pagination dataCnt={dataCnt} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
        </div>
    )
}

export default EtcDetailFooter;