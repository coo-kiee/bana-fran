import { FC, useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { ETC_TAB_TYPE, SearchInfoType } from "types/etc/etcType";

// component 
import VirtualAccountDetail from './VirtualAccountDetail';
import EtcTotalTable from '../component/EtcTotalTable';
import CalanderSearch from 'pages/common/calanderSearch';

const VirtualAccount = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11  
    }); // etcSearch 내부 검색 날짜

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // TODO: EtcDetailTable 관련 데이터     
    const detailTableColGroup = ['170', '170', '503', '503', '503'];
    const detailTableHead = [
        [{ itemName: '거래일시' }, { itemName: '거래구분' }, { itemName: '거래금액' }, { itemName: '적요' }, { itemName: '거래 후 잔액' }]
    ];

    return (
        <>
            <div className="board-date-wrap">
                <EtcTotalTable currTab={ETC_TAB_TYPE.ACCOUNT} />
                <VirtualAccountSearch handleSearchInfo={handleSearchInfo} />
                <VirtualAccountDetail searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </div>
        </>
    )
}

export default VirtualAccount;

const VirtualAccountSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
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