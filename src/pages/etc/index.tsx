import React, { useState, useEffect } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

// type
import { ETC_TAB_LIST, SearchDateType, PageInfoType } from 'types/etcType';

// component
import TabComponents from './components/tabComponents';
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

const EtcContainer = () => {
    const { reset } = useQueryErrorResetBoundary();

    // TODO: 상태 관련
    const [currTab, setCurrTab] = useState(0); // 선택된 탭 메뉴 관련
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 5, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 
    const [searchDate, setSearchDate] = useState<SearchDateType>({
        from: '2022-03-01',
        to: '2022-03-01',
    }); // etcSearch 내부 검색 날짜

    // TODO: 엑셀 프린트 관련 함수
    const handleExcelPrint = () => {
        console.log(`엑셀 다운 버튼 클릭`);
    }; // 엑셀 다운로드 관련 

    // TODO: 내부 컴포넌트 관련
    const tabList = TabComponents({ pageInfo, setPageInfo, searchDate, setSearchDate, handleExcelPrint }); // 탭 컴포넌트

    // TODO: useEffect
    useEffect(() => {
        setPageInfo(prevPageInfo => ({ ...prevPageInfo, currentPage: 1 }));
    }, [pageInfo.row, searchDate]) // 검색 조건 or 데이터 갯수 state 변경 시 페이지네이션 변경

    useEffect(() => {
        setPageInfo(prevPageInfo => ({ ...prevPageInfo, currentPage: 1, row: 5 }));
    }, [currTab]) //  탭 이동 시 검색 날짜, 페이지네이션 관련 상태 리셋

    useEffect(() => {
        console.log(pageInfo);
    }, []); // pageInfo 확인용

    return (
        <section className="container">
            <header>
                <div className="page-title etc">
                    <p className="present">기타내역</p>
                </div>
            </header>
            <section className="contents-wrap etc-wrap">
                <div className='contents'>
                    <ul className="tab-wrap"> {/* 탭메뉴 */}
                        {ETC_TAB_LIST.map((type: number, idx: number) => {
                            return <li key={`etc_tab_${idx}`} className={`tab ${currTab === idx && 'active'}`} data-tab={`tab${idx}`} onClick={() => setCurrTab((prevTab) => idx)}>{tabList[type].title}</li>
                        })}
                    </ul>

                    <React.Suspense fallback={<div>로딩중</div>}>
                        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                            {tabList[currTab].component} {/* 나타나야하는 실제 컴포넌트 */}
                        </ErrorBoundary>
                    </React.Suspense>
                </div>
            </section>
        </section>
    )
}

export default EtcContainer;