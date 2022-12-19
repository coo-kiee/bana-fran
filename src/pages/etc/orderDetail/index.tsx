import { FC } from "react";

// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component 
import OrderDetailDetail from './OrderDetailDetail'; 
import EtcTotalTable from '../component/EtcTotalTable';  

const OrderDetail: FC<{openOrderDetailModal: (nOrderID: number) => void}> = ({ openOrderDetailModal }) => {
    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '120', '110', '150'];
    const detailTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '품목 상세' }, { itemName: '공급가' }, { itemName: '부가세' }, { itemName: '발주 금액' }]
    ];
    
    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.ORDER} /> 
            <OrderDetailDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} openOrderDetailModal={openOrderDetailModal}/>
        </div>
    )
}

export default OrderDetail;
