import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType } from "types/etc/etcType";

// component 
import RoyaltyDetail from './component/RoyaltyDetail';
import RoyaltyOverall from './component/RoyaltyOverall';

const Royalty = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    }); // etcSearch 내부 검색 날짜

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기) 
    const colGroup = ['256', '*', '170', '170', '170'];
    const thead = ['기간', '품목', '공급가', '부가세', '합계'];

    // TODO: EtcSearchDetail 관련 데이터 
    const detailPriceInfo = [['로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)']];

    // TODO: EtcDetailTable 관련 데이터    
    const detailTableColGroup = ['225', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: 'price-area' }, { itemName: '부가세', className: 'price-area' }, { itemName: '합계', className: 'price-area' }]
    ];

    return (
        <div id="tab5" className="tab-content active" >
            <div className="info-wrap" >
                <p>※ 매월 매장 로열티를 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.) </strong></p >
            </div>
            <div className="board-date-wrap" >
                <RoyaltyOverall tableColGroup={colGroup} tableHead={thead} detailPriceInfo={detailPriceInfo} searchInfo={searchInfo} handleSearchInfo={handleSearchInfo} />
            </div>
            <RoyaltyDetail searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
        </div>

    )
}

export default Royalty;