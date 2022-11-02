// components
import DeliveryCharge from "./DeliveryCharge";
import GiftCard from "./GiftCard";
import MusicCharge from "./MusicCharge";
import OrderDetail from "./OrderDetail";
import Royalty from "./Royalty";
import VirtualAccount from "./VirtualAccount";

// type
import { ETC_TAB_TYPE, TabComponentsProps } from 'types/etcType';

// TODO: 탭 컴포넌트 관련
const TabComponents = (props: TabComponentsProps) => {
    const { pageInfo, setPageInfo, searchDate, setSearchDate, handleExcelPrint } = props;

    const TabList = {
        [ETC_TAB_TYPE.DELIVERY]: { title: '바나 딜리버리 수수료', component: <DeliveryCharge pageInfo={pageInfo} setPageInfo={setPageInfo} searchDate={searchDate} setSearchDate={setSearchDate} handleExcelPrint={handleExcelPrint} /> },
        [ETC_TAB_TYPE.MUSIC]: { title: '음악 서비스 이용료', component: <MusicCharge pageInfo={pageInfo} setPageInfo={setPageInfo} searchDate={searchDate} setSearchDate={setSearchDate} handleExcelPrint={handleExcelPrint} /> },
        [ETC_TAB_TYPE.GIFTCARD]: { title: '실물상품권 발주/판매', component: <GiftCard pageInfo={pageInfo} setPageInfo={setPageInfo} searchDate={searchDate} setSearchDate={setSearchDate} handleExcelPrint={handleExcelPrint} /> },
        [ETC_TAB_TYPE.ORDER]: { title: '발주내역', component: <OrderDetail pageInfo={pageInfo} setPageInfo={setPageInfo} searchDate={searchDate} setSearchDate={setSearchDate} handleExcelPrint={handleExcelPrint} /> },
        [ETC_TAB_TYPE.ROYALTY]: { title: '로열티', component: <Royalty /* pageInfo={pageInfo} setPageInfo={setPageInfo} searchDate={searchDate} setSearchDate={setSearchDate} handleExcelPrint={handleExcelPrint} */ /> },
        [ETC_TAB_TYPE.ACCOUNT]: { title: '가상계좌 충전/차감', component: <VirtualAccount /* pageInfo={pageInfo} setPageInfo={setPageInfo} searchDate={searchDate} setSearchDate={setSearchDate} handleExcelPrint={handleExcelPrint} */ /> },
    };

    return TabList;
}

export default TabComponents