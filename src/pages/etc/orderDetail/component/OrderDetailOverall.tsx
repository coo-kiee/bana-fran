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
    console.log(`OrderDetailOverall`)
    const { reset } = useQueryErrorResetBoundary();
    const franCode = useRecoilValue(franState);

    // EtcTable 관련 
    const handleClassNameDefault = (idx: number) => {
        if (idx === 0) return 'align-center';
        else if (idx === 1) return 'align-left';
        else return 'align-right';
    };

    // TODO: 프로시저 
    let tableBody: any = []; // 프로시저 성공 후 업데이트 
    const etcOrderDetailStatParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcOrderDetailStatSuccess, status } = ETC_SERVICE.useOrderDetailStatistic(etcOrderDetailStatParam);

    if (etcOrderDetailStatSuccess) {
        console.log('OrderDetailOverall 프로시저 성공')
        tableBody = [totalData.map((el: any) => ({ data: Utils.numberComma(el.amount), className: 'align-right' }))];
    }

    return (
        <>
            {tableBody.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className || handleClassNameDefault(idx)}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })}
        </>
    )
}

// const OrderDetailOverallData = (tableBody: any) => {
//     const handleClassNameDefault = (idx: number) => {
//         if (idx === 0) return 'align-center';
//         else if (idx === 1) return 'align-left';
//         else return 'align-right';
//     };

//     return (
//         <>
//             {tableBody.map((tr: any, idx: number) => {
//                 return (
//                     <tr key={`etc_table_tr_${idx}`}>
//                         {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className || handleClassNameDefault(idx)}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
//                     </tr>
//                 )
//             })}
//         </>
//     )
// }

// const OrderDetailOverallData: FC<OverallFallbackProps> = ({ title, tableColGroup, tableHead }) => {
//     const franCode = useRecoilValue(franState);
//     // EtcTable 관련 

//     // TODO: 프로시저 
//     let tableBody: any = []; // 프로시저 성공 후 업데이트 
//     const etcOrderDetailStatParam: EtcTotalParams = { fran_store: franCode };
//     const { data: totalData, isSuccess: etcOrderDetailStatSuccess, status } = ETC_SERVICE.useOrderDetailStatistic(etcOrderDetailStatParam);
//     if (etcOrderDetailStatSuccess) {
//         console.log('OrderDetailOverallData 프로시저 성공')
//         tableBody = [totalData.map((el) => ({ data: Utils.numberComma(el.amount), className: 'align-right' }))];
//     }

//     const handleClassNameDefault = (idx: number) => {
//         if (idx === 0) return 'align-center';
//         else if (idx === 1) return 'align-left';
//         else return 'align-right';
//     };

//     return (
//         <>
//             {/* <EtcTable title={title} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} /> */}

//             {tableBody.map((tr: any, idx: number) => {
//                 return (
//                     <tr key={`etc_table_tr_${idx}`}>
//                         {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className || handleClassNameDefault(idx)}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
//                     </tr>
//                 )
//             })}
//         </>
//     )
// }

export default React.memo(OrderDetailOverall);