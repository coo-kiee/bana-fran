import React from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

const MounthRankContainer = () => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <section className="container">
            <header>
                <div className="page-title etc">
                    <p className="present">월간 랭킹 현황</p>
                </div>
            </header>
            <section className="contents-wrap etc-wrap">
                <div className='contents'>
                    <React.Suspense fallback={<div>로딩중</div>}>
                        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <div onClick={resetErrorBoundary}>에러</div>} >
                            <MonthRankContainerData />
                        </ErrorBoundary>
                    </React.Suspense>
                </div>
            </section>
        </section>
    )
}

const MonthRankContainerData = () => {
    return (
        <div>MonthRankContainerData</div>
    )
}

export default MounthRankContainer;