import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// component  
import EtcTable from "pages/etc/component/EtcTable";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// state
import { franState } from 'state';

// API
import ETC_SERVICE from 'service/etcService';

// type
import { EtcTotalParams, OverallFallbackProps, TotalResultType } from "types/etc/etcType";

const DeliveryChargeOverall: FC<Omit<OverallFallbackProps, 'title'>> = ({ tableColGroup, tableHead }) => {
    const { reset } = useQueryErrorResetBoundary();
    const title = `${format(subMonths(new Date(), 1), `yyyy년 M월 바나 딜리버리 수수료 내역`)}`;

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
                            <DeliveryChargeOverallData title={title} tableColGroup={tableColGroup} tableHead={tableHead} />
                        </ErrorBoundary>
                    </React.Suspense>
                </tbody>
            </table>
        </>
    )
}

const DeliveryChargeOverallData: FC<OverallFallbackProps> = ({ title, tableColGroup, tableHead }) => {
    const franCode = useRecoilValue(franState);
    // EtcTable 관련 
    let tableBody: any = []; // 프로시저 성공 후 업데이트

    // TODO: 프로시저 
    const etcDeliveryTotalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcDeliveryTotalSuccess } = ETC_SERVICE.useEtcTotal<EtcTotalParams, TotalResultType>('YDKG75HJE31EPGS47MXQ', etcDeliveryTotalParam, 'etc_delivery_total');
    if (etcDeliveryTotalSuccess) {
        tableBody = [
            [
                { data: `${format(subMonths(new Date(), 1), 'yyyy/MM/01')}~${format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy/MM/dd')}` },
                { data: '바나 딜리버리 수수료(주문금액의 2%, VAT 별도)' },
                { data: `${totalData.suply_fee}` },
                { data: `${totalData.suply_fee_tax}` },
                { data: `${totalData.total_fee}` },
            ]
        ];
    }

    return (
        <>
            {/* 수수료 내역 -> total 프로시저 관련 */}
            <EtcTable title={title} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
        </>
    )
}

export default DeliveryChargeOverall;