// components
import Tab from 'pages/common/tab';
import EventDetail from './components/EventDetail';

// type, constants
import { EVENT_TAB_TITLE } from 'constants/event';

const index = () => {
  return (
    <section className="container min-with-1600">
      <header>
        <div className="page-title etc">
          <p className="present">이벤트쿠폰현황</p>
        </div>
      </header>
      <section className="contents-wrap event_current">
        <div className="contents">
          <div className="info-wrap">
            ※가맹점앱 등을 통해 매장에서 직접 발급한 이벤트(LSM) 쿠폰의 사용현황을 조회할 수 있습니다.
          </div>
          <Tab tabTitleObj={EVENT_TAB_TITLE} render={(tabType) => <EventDetail tabType={tabType} />} />
        </div>
      </section>
    </section>
  );
};

export default index;
