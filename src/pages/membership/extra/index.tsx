import React from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

const ExtraContainer = () => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <section className="container">
            <header>
                <div className="page-title etc">
                    <p className="present">스탬프/쿠폰/바나포인트</p>
                </div>
            </header>
            <section className="contents-wrap etc-wrap">
                <div className='contents'>
                    <React.Suspense fallback={<div>로딩중</div>}>
                        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <div onClick={resetErrorBoundary}>에러</div>} >
                            <ExtraConatainerData />
                        </ErrorBoundary>
                    </React.Suspense>
                </div>
            </section>
        </section>
    )
}

const ExtraConatainerData = () => {
    return (
        <div>ExtraConatainerData</div>
    )
}

export default ExtraContainer;