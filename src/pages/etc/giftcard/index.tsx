// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component 
import GiftCardDetail from './GiftCardDetail';
import EtcTotalTable from '../component/EtcTotalTable'; 

const GiftCard = () => {
    // TODO: EtcDetailTable 관련 데이터 
    const detailTableColGroup = ['195', '195', '195', '195', '195', '195'];
    const detailTableHead = [
        [ { itemName: '일시'}, { itemName: '구분'}, { itemName: '상품권종'}, { itemName: '수령(금액)'}, { itemName: '판매기기'}, { itemName: '가상계좌 충전/차감'} ],
    ];
    const summaryInfo = [
        ['키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.'],
        ['어플 판매금액은 가상계좌에서 차감되지 않습니다.'],
        ['판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.']
    ]

    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.GIFTCARD} /> 
            <GiftCardDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} summaryInfo={summaryInfo}/>
        </div>
    )
}

export default GiftCard;