import { useParams } from 'react-router-dom';

// Const
import { PAGE_URL } from 'pages/common/sideMenubar/data/SideMenu';
import { NOTICE_TAB_TITLE } from 'constants/notice';

// component
import Layout from 'pages/common/layout';
import BoardTab from 'pages/common/tab/BoardTab';
import NoticeContent from './NoticeContent';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';

const NoticeContainer = () => {
  const { bId = '' } = useParams();

  return (
    <Layout>
      <section className={`contents-wrap ${bId ? 'notice-view-wrap' : 'notice-wrap'}`}>
        <div className="contents">
          <BoardTab
            baseUrl={`${PAGE_URL.NOTICE}`}
            urlParamKey="bType"
            tabTitleObj={NOTICE_TAB_TITLE}
            render={(tabType) => (
              <PageInfoProvider>
                <div id="tab1" className="tab-content active">
                  <NoticeContent tabType={tabType} />
                </div>
              </PageInfoProvider>
            )}
          />
        </div>
      </section>
    </Layout>
  );
};

export default NoticeContainer;
