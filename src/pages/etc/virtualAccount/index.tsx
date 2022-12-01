// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component 
import VirtualAccountDetail from './VirtualAccountDetail';
import EtcTotalTable from '../component/EtcTotalTable';

const VirtualAccount = () => { 
    // TODO: EtcDetailTable 관련 데이터     
    const detailTableColGroup = ['170', '170', '503', '503', '503'];
    const detailTableHead = [
        [{ itemName: '거래일시' }, { itemName: '거래구분' }, { itemName: '거래금액' }, { itemName: '적요' }, { itemName: '거래 후 잔액' }]
    ];

    return (
        <>
            <div className="board-date-wrap">
                <EtcTotalTable currTab={ETC_TAB_TYPE.ACCOUNT} /> 
                <VirtualAccountDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </div>
        </>
    )
}

export default VirtualAccount;