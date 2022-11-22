import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType } from "types/etc/etcType";

// component
import VirtualAccountOverall from './component/VirtualAccountOverall';
import VirtualAccountDetail from './component/VirtualAccountDetail';

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

    // TODO: 프로시저
    // isSuccess로 확인 뒤 아래 관련 데이터 업데이트 
    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기) 
    const colGroup = ['300', '270', '270', '*', '270', '270'];
    const thead = ['매장', '은행', '계좌번호', '충 충전금액', '총 차감금액', '잔액'];

    // TODO: EtcSearchDetail 관련 데이터
    // ? 프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?) 
    // const detailSearchResult = [
    //     ['충전', '10,000'], ['차감', '10,000'],
    // ];

    // TODO: EtcDetailTable 관련 데이터     
    const detailTableColGroup = ['170', '170', '503', '503', '503'];
    const detailTableHead = [
        [{ itemName: '거래일시' }, { itemName: '거래구분' }, { itemName: '거래금액' }, { itemName: '적요' }, { itemName: '거래 후 잔액' }]
    ];

    return (
        <div id="tab6" className="tab-content active">
            <div className="info-wrap">
                <p>※ 가상계좌 충전/차감 내역을 조회할 수 있습니다.</p>
            </div>
            <div className="board-date-wrap">
                <VirtualAccountOverall tableColGroup={colGroup} tableHead={thead} searchInfo={searchInfo} handleSearchInfo={handleSearchInfo} />
            </div>

            <VirtualAccountDetail searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
        </div>
    )
}

export default VirtualAccount;