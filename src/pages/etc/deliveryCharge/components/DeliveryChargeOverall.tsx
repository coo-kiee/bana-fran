import React from "react";
import { useRecoilValue } from "recoil";
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { useQueryClient } from "react-query";

// component 
import EtcTable from "pages/etc/component/EtcTable";

// state
import { franState } from 'state';

// API
import { useEtcTotal } from 'service/etcService';

// type
import { EtcTotalParams, DeliveryChargeOverallProps, TotalResultType } from "types/etc/etcType";

const DeliveryChargeOverall: React.FC<DeliveryChargeOverallProps> = ({ tableColGroup, tableHead }) => {
    const franCode = useRecoilValue(franState);

    // EtcTable 관련 
    let tableBody: string[][] = []; // 프로시저 성공 후 업데이트

    // TODO: 프로시저 
    const etcDeliveryTotalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcDeliveryTotalSuccess } = useEtcTotal<EtcTotalParams, TotalResultType>('YDKG75HJE31EPGS47MXQ', etcDeliveryTotalParam, 'etc_delivery_total');
    if (etcDeliveryTotalSuccess) {
        tableBody = [
            [`${format(subMonths(new Date(), 1), 'yy/MM/01')}~${format(lastDayOfMonth(subMonths(new Date(), 1)), 'yy/MM/dd')}`, '바나 딜리버리 수수료(주문금액의 2%, VAT 별도)', `${totalData.suply_fee}`, `${totalData.suply_fee_tax}`, `${totalData.total_fee}`]
        ];
    }

    return (
        <>
            {/* 수수료 내역 -> total 프로시저 관련 */}
            <EtcTable title={`${format(subMonths(new Date(), 1), `yyyy년 M월 바나 딜리버리 수수료 내역`)}`} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
        </>
    )
}

export default DeliveryChargeOverall;