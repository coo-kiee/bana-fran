import { useLocation } from 'react-router-dom';
// Components
import SalesStatistic from './statistic';
import SalesHistory from './history';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';

const SalesContainer = () => {
  const { pathname } = useLocation();
  const path = pathname.replace('/sales/', ''); // URL path

  return (
    <section className="container min-width-2250">
      <header>
        <div className="page-title sales">
          <p className="present">매출관리</p>
          <p className="spot">{path === 'history' ? '주문내역' : '매출통계'}</p>
        </div>
      </header>
      <section className={`contents-wrap sales_${path === 'history' ? 'order' : 'statistic'}`}>
        <div className="contents">
          {path === 'history' ? (
            <SalesHistory />
          ) : (
            <PageInfoProvider>
              <SalesStatistic />
            </PageInfoProvider>
          )}
        </div>
      </section>
    </section>
  );
};

export default SalesContainer;
