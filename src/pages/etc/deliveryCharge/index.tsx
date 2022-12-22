// component   
import DeliveryChargeDetail from "./DeliveryChargeDetail";

// type
import { TableHeadItemType, ETC_TAB_TYPE } from "types/etc/etcType"; 
import EtcTotalTable from "../component/EtcTotalTable"; 

const DeliveryCharge = () => {  
    // column 관련 데이터  
    const detailTableColGroup = ['188', '*', '120', '120', '150', '190', '136', '150', '150', '150'];
    const detailTableHead: TableHeadItemType[][] = [
        [{ itemName: '결제일시', rowSpan: 2 }, { itemName: '메뉴', rowSpan: 2 }, { itemName: '주문금액', rowSpan: 2 }, { itemName: '배달비', rowSpan: 2 }, { itemName: '결제방식', rowSpan: 2 }, { itemName: '결제수단', rowSpan: 2 }, { itemName: '주문자', rowSpan: 2 }, { itemName: '바나 딜리버리 수수료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '수수료 공급가 (2%)', className: "price-area" }, { itemName: '부가세 (0.2%)', className: "price-area" }, { itemName: '수수료 합계 (2.2%)', className: "price-area" },]
    ];
    const summaryInfo = [ 
        ['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'], 
        ['수수료 공급가', '주문금액의 2% (부가세 별도.)']
    ];

    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.DELIVERY} />
            <DeliveryChargeDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} summaryInfo={summaryInfo} />
        </div>
    )
}

export default DeliveryCharge;