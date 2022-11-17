import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType } from "types/etc/etcType";

// component  
import MusicChargeOverall from './component/MusicChargeOverall';
import MusicChargeDetail from './component/MusicChargeDetail';

const MusicCharge = () => {
    // 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    }); // etcSearch 내부 검색 날짜

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // column 관련 데이터
    const tableColGroup = ['188', '*', '150', '150', '150'];
    const tableHead = ['기간', '품목', '공급가', '부가세', '수수료 합계 (2.2%)'];
    const detailPriceInfo = [['음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)']];
    const detailTableColGroup = ['188', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '내용', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: "price-area" }, { itemName: '부가세', className: "price-area" }, { itemName: '합계', className: "price-area" }]
    ];

    return (
        <div id="tab2" className="tab-content active">
            <div className="info-wrap">
                <p>※ 매월 매장 음악 서비스 이용료를 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* *_total 프로시저 사용 컴포넌트 */}
                <MusicChargeOverall tableColGroup={tableColGroup} tableHead={tableHead} />
                {/* *_list 프로시저 사용하는 컴포넌트 */}
                <MusicChargeDetail searchInfo={searchInfo} detailPriceInfo={detailPriceInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </div>
        </div>
    )
}

export default MusicCharge;