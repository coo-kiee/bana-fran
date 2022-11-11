import React from "react";
import { useRecoilValue } from "recoil";
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// component 
import EtcTable from "pages/etc/component/EtcTable";

// state
import { franState } from 'state';

// API
import { useEtcTotal } from 'service/etcService';

// type
import { EtcTotalParams, MusicChargeOverallProps, TotalResultType } from "types/etc/etcType";

const MusicChargeOverall: React.FC<MusicChargeOverallProps> = ({ tableColGroup, tableHead }) => {
    const franCode = useRecoilValue(franState);

    // EtcTable 관련 
    let tableBody: string[][] = []; // 프로시저 성공 후 업데이트

    // TODO: 프로시저 
    const etcMusicTotalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcMusicTotalSuccess } = useEtcTotal<any, TotalResultType>('8WDCFLDHSNA7WRN9JCBS', etcMusicTotalParam, 'etc_music_fee');

    if (etcMusicTotalSuccess) {
        tableBody = [
            [`${format(subMonths(new Date(), 1), 'yy/MM/01')}~${format(lastDayOfMonth(subMonths(new Date(), 1)), 'yy/MM/dd')}`, '바나 딜리버리 수수료(주문금액의 2%, VAT 별도)', `${totalData.suply_fee}`, `${totalData.suply_fee_tax}`, `${totalData.total_fee}`]
        ];
    }

    return (
        // 수수료 내역 -> total 프로시저 관련 
        <EtcTable title={`${format(subMonths(new Date(), 1), `yyyy년 M월 음악 서비스 이용료`)}`} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
    )
}

export default MusicChargeOverall;