import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// component 
import EtcTable from "pages/etc/component/EtcTable";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// state
import { franState } from 'state';

// API
import ETC_SERVICE from "service/etcService";

// type
import { OverallFallbackProps, EtcTotalParams, TotalResultType } from "types/etc/etcType";

const GiftCardOverall: FC<Omit<OverallFallbackProps, 'title'>> = ({ tableColGroup, tableHead }) => {
    const { reset } = useQueryErrorResetBoundary();
    const title = `실물 상품권 재고 현황`;

    return (
        <>
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
                    <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
                        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />}>
                            {/* *_total 프로시저 사용 컴포넌트 */}
                            <GiftCardOverallData title={title} tableColGroup={tableColGroup} tableHead={tableHead} />
                        </ErrorBoundary>
                    </React.Suspense>
                </tbody>
            </table>
        </>
    )
}

const GiftCardOverallData: FC<OverallFallbackProps> = ({ title, tableColGroup, tableHead }) => {
    const franCode = useRecoilValue(franState);

    // EtcTable 관련 
    let tableBody: any = []; // 프로시저 성공 후 업데이트

    // TODO: 프로시저 
    const etcGiftCardTotalParam: EtcTotalParams = { fran_store: franCode };
    // !! 다른 페이지 프로시저 -> 나오면 고치기
    const { data: totalData, isSuccess: etcGiftCardTotalSuccess } = ETC_SERVICE.useEtcTotal<any, TotalResultType>('2Q65LKD2JBSZ3OWKWTWY', etcGiftCardTotalParam, 'etc_giftcard_statistic');

    if (etcGiftCardTotalSuccess) {
        console.log('etcGiftCardTotal: ', totalData)
        tableBody = [
            [
                { data: `*매장 보유 재고`, className: 'align-center' },
                { data: `10장 (100,000원)`, className: 'align-center' },
                { data: `9장 (270,000원)`, className: 'align-center' },
                { data: `2장 (100,000원)`, className: 'align-center' },
                { data: `21장 (470,000원)`, className: 'align-center' },
            ],
            [
                { data: `본사DB 재고`, className: 'align-center' },
                { data: `10장 (100,000원)`, className: 'align-center' },
                { data: `9장 (270,000원)`, className: 'align-center' },
                { data: `2장 (100,000원)`, className: 'align-center' },
                { data: `21장 (470,000원)`, className: 'align-center' },
            ],
        ];
    }

    return (
        // 수수료 내역 -> total 프로시저 관련 
        <EtcTable title={title} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
    )
}

export default GiftCardOverall;