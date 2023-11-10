// type
import { ETC_TAB_TITLE } from 'constants/etc';
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// component
import Tab from 'pages/common/tab';
import EtcInfo from './component/EtcInfo';
import DeliveryCharge from './deliveryCharge';
import GiftCard from './giftcard';
import MusicCharge from './musicCharge';
import OrderDetail from './orderDetail';
import Royalty from './royalty';
import VirtualAccount from './virtualAccount';

const EtcContainer = () => {
  const tab = (tabType: ETC_TAB_TYPE) => {
    switch (tabType) {
      case ETC_TAB_TYPE.DELIVERY:
        return <DeliveryCharge tabType={tabType} />;
      case ETC_TAB_TYPE.MUSIC:
        return <MusicCharge tabType={tabType} />;
      case ETC_TAB_TYPE.GIFTCARD:
        return <GiftCard tabType={tabType} />;
      case ETC_TAB_TYPE.ORDER:
        return <OrderDetail tabType={tabType} />;
      case ETC_TAB_TYPE.ROYALTY:
        return <Royalty tabType={tabType} />;
      case ETC_TAB_TYPE.ACCOUNT:
        return <VirtualAccount tabType={tabType} />;
      default:
        return <div className="board-date-wrap">잘못된 접근입니다.</div>;
    }
  };

  return (
    <>
      <section className="container min-width-1600">
        <header>
          <div className="page-title etc">
            <p className="present">기타내역</p>
          </div>
        </header>
        <section className="contents-wrap etc-wrap">
          <div className="contents">
            <Tab
              tabTitleObj={ETC_TAB_TITLE}
              render={(tabType) => (
                <div id={`tab${tabType + 1}`} className="tab-content active">
                  <EtcInfo tabType={tabType} />
                  {tab(tabType)}
                </div>
              )}
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default EtcContainer;
