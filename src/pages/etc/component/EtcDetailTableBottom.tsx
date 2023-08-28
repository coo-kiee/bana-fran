import { FC } from "react"

// type
import { PageInfoType } from "types/etc/etcType"

// component 
import Pagination from "pages/common/pagination"

interface EtcDetailTableBottomProps {
    dataCnt: number,
    pageInfo: PageInfoType,
    handleExcelDownload: () => void,
    setPageInfo: React.Dispatch<React.SetStateAction<PageInfoType>>,
}

const EtcDetailTableBottom: FC<EtcDetailTableBottomProps> = ({ handleExcelDownload, dataCnt, pageInfo, setPageInfo}) => {
    const handlePageChange = (changePage: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, currentPage: changePage }))
    }
    const handlePageRow = (row: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, row }))
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

export default EtcDetailTableBottom;