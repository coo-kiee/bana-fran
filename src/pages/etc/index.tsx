import { useState } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { ETC_TAB_LIST, ETC_TAB_TYPE, PopupOrderDetailType } from 'types/etc/etcType';

// component  
import DeliveryCharge from './deliveryCharge';
import GiftCard from './giftcard';
import MusicCharge from './musicCharge';
import OrderDetail from './orderDetail';
import Royalty from './royalty';
import VirtualAccount from './virtualAccount';
import EtcOrderDetail from './component/EtcOrderDetail';

const EtcContainer = () => {
    // TODO: 상태 관련
    const [currTab, setCurrTab] = useState(0); // 선택된 탭 메뉴 관련
    const [popupOrderDetail, setPopupOrderDetail] = useState<PopupOrderDetailType>({
        show: false,
        data: []
    }); // EtcOrderDetail 열림 여부

    // TODO: 내부 컴포넌트 관련
    const tabList = {
        [ETC_TAB_TYPE.DELIVERY]: { title: '바나 딜리버리 수수료', component: <DeliveryCharge /> },
        [ETC_TAB_TYPE.MUSIC]: { title: '음악 서비스 이용료', component: <MusicCharge /> },
        [ETC_TAB_TYPE.GIFTCARD]: { title: '실물상품권 발주/판매', component: <GiftCard /> },
        [ETC_TAB_TYPE.ORDER]: { title: '발주내역', component: <OrderDetail setPopupOrderDetail={setPopupOrderDetail} /> },
        [ETC_TAB_TYPE.ROYALTY]: { title: '로열티', component: <Royalty /> },
        [ETC_TAB_TYPE.ACCOUNT]: { title: '가상계좌 충전/차감', component: <VirtualAccount /> },
    };

    return (
        <>
            <section className="container">
                <header>
                    <div className="page-title etc">
                        <p className="present">기타내역</p>
                    </div>
                </header>
                <section className="contents-wrap etc-wrap">
                    <div className='contents'>
                        <ul className="tab-wrap"> {/* 탭메뉴 */}
                            {ETC_TAB_LIST.map((type: number, idx: number) => {
                                return <li key={`etc_tab_${idx}`} className={`tab ${currTab === idx && 'active'}`} data-tab={`tab${idx}`} onClick={() => setCurrTab((prevTab) => idx)}>{tabList[type].title}</li>
                            })}
                        </ul>

                        {tabList[currTab].component}
                    </div>
                </section>
            </section>
            {popupOrderDetail.show && <EtcOrderDetail setPopupOrderDetail={setPopupOrderDetail} popupOrderDetail={popupOrderDetail} />}
        </>
    )
}

export default EtcContainer;