// components
import Layout from 'pages/common/layout';
import Tab from 'pages/common/tab';
import EventDetail from './components/EventDetail';

// type, constants
import { EVENT_TAB_TITLE } from 'constants/event';

const index = () => {
  return (
    <Layout>
      <section className="contents-wrap event_current">
        <div className="contents">
          <div className="info-wrap">
            ※가맹점앱 등을 통해 매장에서 직접 발급한 이벤트(LSM) 쿠폰의 사용현황을 조회할 수 있습니다.
          </div>
          <Tab tabTitleObj={EVENT_TAB_TITLE} render={(tabType) => <EventDetail key={tabType} tabType={tabType} />} />
        </div>
      </section>
    </Layout>
  );
};

export default index;
