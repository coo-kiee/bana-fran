import { MouseEventHandler, useState, useEffect } from 'react';

// type
import { PageInfoType } from "types/etcType";

interface EtcDetailFooterProps {
    excelFn: () => void, // 엑셀 다운로드 함수 
    filterOption: Array<number>, // .filter-number 내 숫자 옵션
    dataCnt: number, // 데이터 총 갯수
    pageInfo: PageInfoType,
    boundaryRange?: number, // 화면에 노출되는 페이지 번호 갯수
    pageFn: (target: { [key in keyof PageInfoType]?: PageInfoType[key] }) => void, // .paging li 클릭했을때 pageInfo 변경하는 함수 
}
interface PagenationType {
    startPage: number,
    endPage: number,
    maxPage: number,
}
// TODO: 엑셀 다운, 페이지네이션, 정렬 관련 (.result-function-wrap 부분)
const EtcDetailFooter: React.FC<EtcDetailFooterProps> = (props) => {
    const { excelFn, pageFn, filterOption, dataCnt, pageInfo: { row = 10, currentPage }, boundaryRange = 5 } = props;

    // TODO: 상태 관련
    const [pagination, setPagination] = useState<PagenationType>({
        startPage: 1,
        endPage: 1,
        maxPage: 1,
    });
    const pageArr = Array.from({ length: pagination.maxPage }, (value, index: number) => index + 1); // .paging li 요소

    // TODO: 상태 관련 함수
    const paginate = (dataCnt: number) => {
        const maxPage = Math.ceil(dataCnt / row);
        // console.log(`maxPage(${maxPage}): Math.ceil(dataCnt(${dataCnt}) / row(${row}))`)

        const viewPoint = (pagination.maxPage - (boundaryRange - 1)) < 1 ? 1 : (pagination.maxPage - (boundaryRange - 1)); // 끝 페이지 노출 기준점
        // console.log(`viewPoint(${viewPoint}): (pagination.maxPage(${pagination.maxPage}) - (boundaryRange(${boundaryRange}) - 1)) < 1 ? 1 : (pagination.maxPage(${pagination.maxPage}) - (boundaryRange(${boundaryRange}) - 1))`)

        const startPage = (currentPage - Math.floor(boundaryRange / 2)) > viewPoint ? viewPoint : (currentPage - Math.floor(boundaryRange / 2));
        // console.log(`startPage(${startPage}): (currentPage(${currentPage}) - Math.floor(boundaryRange(${boundaryRange}) / 2)) > viewPoint(${viewPoint}) ? viewPoint(${viewPoint}) : (currentPage(${currentPage}) - Math.floor(boundaryRange(${boundaryRange}) / 2))`)

        const endPage = (currentPage + Math.floor(boundaryRange / 2)) > boundaryRange ? (currentPage + Math.floor(boundaryRange / 2)) : boundaryRange;
        // console.log(`endPage(${endPage}): (currentPage(${currentPage}) + Math.floor(boundaryRange(${boundaryRange}) / 2)) > boundaryRange(${boundaryRange}) ? (currentPage(${currentPage}) + Math.floor(boundaryRange(${boundaryRange}) / 2)) : boundaryRange;`)
        return { maxPage, startPage, endPage };
    }; // 기준점, 첫번째/마지막 페이지 관련
    const handleArrowButton: MouseEventHandler<HTMLButtonElement> = (e) => {
        const className = e.currentTarget.className;
        let changePage = 0;

        if (className.includes('prev')) {
            changePage = currentPage - boundaryRange;
            changePage = changePage < 1 ? 1 : changePage;
        }
        else if (className.includes('next')) {
            changePage = currentPage + boundaryRange;
            changePage = changePage > pagination.maxPage ? pagination.maxPage : changePage;
        };
        pageFn({ currentPage: changePage });
    }; // 이전,다음 페이지 이동

    // TODO: useEffect
    useEffect(() => {
        const { maxPage, startPage, endPage } = paginate(dataCnt); // pagenation 기준점, 시작 페이지, 마지막 페이지 확인
        setPagination(prev => ({ ...prev, maxPage, startPage, endPage })); // 확인한 부분으로 setState
    }, [dataCnt, row]);

    return (
        <div className="result-function-wrap">
            <div className="function">
                <button className="goast-btn" onClick={excelFn}>엑셀다운</button>
            </div>
            <div className="paging-wrap">
                <button className="btn-prev" onClick={handleArrowButton}></button>
                <ul className="paging">
                    {pageArr.map((page, idx) => {
                        if (page >= pagination.startPage && page <= pagination.endPage) {
                            return <li key={`paging-li-${idx}`} className={currentPage === page ? 'active' : ''} onClick={() => pageFn({ currentPage: page })}>{page}</li>
                        }
                        return true;
                    })}
                </ul>
                <button className="btn-next" onClick={handleArrowButton}></button>
            </div>
            <select className="filter-number" name="" id="" onChange={(e) => pageFn({ row: Number(e.target.value) })}>
                {filterOption.map((filter, idx) => <option key={`filter-number-${idx}`} value={filter}>{filter}개</option>)}
            </select>
        </div>
    )
}

export default EtcDetailFooter;