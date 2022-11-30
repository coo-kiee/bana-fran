// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component 
import GiftCardDetail from './GiftCardDetail';
import EtcTotalTable from '../component/EtcTotalTable'; 

const GiftCard = () => {
    // TODO: EtcDetailTable 관련 데이터 
    const detailTableColGroup = ['195', '195', '195', '195', '195', '195', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '일시', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: '상품권종', rowSpan: 2 }, { itemName: '수령(금액)', rowSpan: 2 }, { itemName: '판매기기', rowSpan: 2 }, { itemName: '가상계좌 충전/차감', rowSpan: 2 }, { itemName: '재고', colSpan: 3, className: 'price-area' }],
        [{ itemName: '1만원권', className: "price-area" }, { itemName: '3만원권', className: "price-area" }, { itemName: '5만원권', className: "price-area" }]
    ];

    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.GIFTCARD} /> 
            <GiftCardDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
        </div>
    )
}

export default GiftCard;