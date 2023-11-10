import { useParams } from 'react-router-dom';

// Const
import { PAGE_URL } from 'pages/common/sideMenubar/data/SideMenu';
import { BOARD_TAB_TITLE } from 'constants/board';

// component
import Layout from 'pages/common/layout';
import BoardTab from 'pages/common/tab/BoardTab';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import BoardContent from './BoardContent';

const BoardContainer = () => {
  const { bId = '' } = useParams();

  return (
    <Layout>
      <section className={`contents-wrap ${bId ? 'notice-view-wrap' : 'notice-wrap'}`}>
        <div className="contents">
          <BoardTab
            baseUrl={`${PAGE_URL.BOARD}`}
            tabTitleObj={BOARD_TAB_TITLE}
            render={(tabType) => (
              <PageInfoProvider>
                <div id="tab1" className="tab-content active">
                  <BoardContent tabType={tabType} />
                </div>
              </PageInfoProvider>
            )}
          />
        </div>
      </section>
    </Layout>
  );
};

export default BoardContainer;
