// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component   
import MusicChargeDetail from './MusicChargeDetail';
import EtcTotalTable from '../component/EtcTotalTable'; 

const MusicCharge = () => { 
    // column 관련 데이터  
    const detailTableColGroup = ['188', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '내용', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: "price-area" }, { itemName: '부가세', className: "price-area" }, { itemName: '합계', className: "price-area" }]
    ];

    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.MUSIC} /> 
            <MusicChargeDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
        </div>
    )
}

export default MusicCharge;