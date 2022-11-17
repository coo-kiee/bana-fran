import { useState } from 'react';
import { format, subMonths } from 'date-fns';

// type
import { SearchInfoType } from "types/etc/etcType";

// component
import OrderDetailOverall from './component/OrderDetailOverall';
import OrderDetailDetail from './component/OrderDetailDetail';

const OrderDetail = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd')
    }); // etcSearch 내부 검색 날짜 

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['147', '147', '147', '147', '147', '147', '147', '147', '147', '147'];
    const thead = Array.from({ length: 10 }, (_, idx1) => idx1).map((el) => format(subMonths(new Date(), el), 'yyyy-MM')).reverse();

    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '150'];
    const detailTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '품목 상세' }, { itemName: '발주 금액' }]
    ];

    return (
        <div id="tab4" className="tab-content active">
            <div className="info-wrap">
                <p>※ 상세 발주 내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                <OrderDetailOverall tableColGroup={colGroup} tableHead={thead} />
                <OrderDetailDetail searchInfo={searchInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </div>
        </div>
    )
}

export default OrderDetail;