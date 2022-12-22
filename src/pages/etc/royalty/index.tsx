// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component 
import RoyaltyDetail from './RoyaltyDetail';
import EtcTotalTable from '../component/EtcTotalTable'; 

const Royalty = () => { 
    // TODO: EtcDetailTable 관련 데이터    
    const detailTableColGroup = ['225', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: 'price-area' }, { itemName: '부가세', className: 'price-area' }, { itemName: '합계', className: 'price-area' }]
    ];
    const summaryInfo = [['로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)']]

    return (
        <>
            <div className="board-date-wrap" >
                <EtcTotalTable currTab={ETC_TAB_TYPE.ROYALTY} /> 
                <RoyaltyDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} summaryInfo={summaryInfo} />
            </div>
        </>
    )
}

export default Royalty; 
