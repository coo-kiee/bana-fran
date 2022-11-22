import React, { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';

// state
import { franState } from 'state';

// API
import ETC_SERVICE from 'service/etcService';

// component  
import EtcTable from "pages/etc/component/EtcTable";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// type
import { EtcTotalParams, OverallFallbackProps } from "types/etc/etcType";

const OrderDetailOverall: FC<Omit<OverallFallbackProps, 'title'>> = ({ tableColGroup, tableHead }) => {
    const { reset } = useQueryErrorResetBoundary();
    const title = `월별 발주금액 통계`;

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
                            <OrderDetailOverallData title={title} tableColGroup={tableColGroup} tableHead={tableHead} />
                        </ErrorBoundary>
                    </React.Suspense>
                </tbody>
            </table>
        </>
    )
}

const OrderDetailOverallData: FC<OverallFallbackProps> = ({ title, tableColGroup, tableHead }) => {
    const franCode = useRecoilValue(franState);
    // EtcTable 관련 
    let tableBody: any = []; // 프로시저 성공 후 업데이트

    // TODO: 프로시저 
    const etcOrderDetailStatParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcOrderDetailStatSuccess } = ETC_SERVICE.useOrderDetailStatistic(etcOrderDetailStatParam);
    // const { data: totalData, isSuccess: etcOrderDetailStatSuccess } = useEtcTotal<any, { [key: string]: any }[]>('2Q65LKD2JBSZ3OWKWTWY', etcOrderDetailStatParam, 'etc_order_detail_statistic', selectFn);
    if (etcOrderDetailStatSuccess) {
        tableBody = [totalData.map((el) => ({ data: Utils.numberComma(el.amount), className: 'align-right' }))];
    }

    return (
        <>
            {/* 수수료 내역 -> total 프로시저 관련 */}
            <EtcTable title={title} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
        </>
    )
}

export default OrderDetailOverall;