import { FC, useState } from 'react';
import { format, subMonths } from 'date-fns';

// type
import { ETC_TAB_TYPE, SearchInfoType } from "types/etc/etcType";

// component 
import RoyaltyDetail from './RoyaltyDetail';
import EtcTotalTable from '../component/EtcTotalTable';
import CalanderSearch from 'pages/common/calanderSearch';

const Royalty = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-10 
    }); // etcSearch 내부 검색 날짜 
    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할) 

    // TODO: EtcSearchDetail 관련 데이터 
    const detailPriceInfo = [['로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)']];

    // TODO: EtcDetailTable 관련 데이터    
    const detailTableColGroup = ['225', '*', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '기간', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '공급가', className: 'price-area' }, { itemName: '부가세', className: 'price-area' }, { itemName: '합계', className: 'price-area' }]
    ];
    return (
        <>
            <div className="board-date-wrap" >
                <EtcTotalTable currTab={ETC_TAB_TYPE.ROYALTY} />
                <RoyaltyOverallSearch handleSearchInfo={handleSearchInfo} />
                <RoyaltyDetail searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead}  />
            </div>
        </>
    )
}

export default Royalty;

const RoyaltyOverallSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    // 로열티 검색
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11  
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}
