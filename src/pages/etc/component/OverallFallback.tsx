import { FC } from "react"

// component
import Loading from "pages/common/loading"
import SuspenseErrorPage from "pages/common/suspenseErrorPage"

// type
import { SearchInfoType } from "types/etc/etcType"
interface OverallFallbackProps {
    title: string,
    tableColGroup: string[],
    tableHead: string[],
    searchInfo: SearchInfoType,
    type: 'LOADING' | 'ERROR',
    resetErrorBoundary?: () => void,
}

const OverallFallback: FC<OverallFallbackProps> = ({ title, tableColGroup, tableHead, searchInfo, type, resetErrorBoundary }) => {
    return (
        <>
            {/* 로열티 내역 테이블 컴포넌트 */}
            <p className="title bullet">{title}</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {tableColGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                </colgroup>
                <thead>
                    <tr>
                        {tableHead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {type === 'LOADING' && <Loading width={50} height={50} isTable={true} />}
                    {type === 'ERROR' && !!resetErrorBoundary && <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />}
                </tbody>
            </table>

            {/* 검색 컴포넌트 */}
            <p className='title bullet'>상세내역</p>
            <div className="search-wrap">
                <div className="input-wrap">
                    <input type="text" placeholder={searchInfo.from} defaultValue={searchInfo.from} />
                    <i>~</i>
                    <input type="text" placeholder={searchInfo.to} defaultValue={searchInfo.to} />
                </div>
                <button className="btn-search">조회</button>
            </div>
            {/*조회기간 관련 */}
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {`${searchInfo.from} ~ ${searchInfo.to}`}</p>
                </div>
            </div>
        </>
    )
}

export default OverallFallback;