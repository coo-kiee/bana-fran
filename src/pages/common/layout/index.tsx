import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

// URL
import { PAGE_URL } from '../sideMenubar/data/SideMenu';

// Component
import LayoutHeader from './LayoutHeader';

const CONTAINER_CLASS_NAME = {
  [PAGE_URL.HOME]: 'min-width-2250',
  [PAGE_URL.NOTICE]: 'min-width-1200',
  [PAGE_URL.BOARD]: 'min-width-1200',
  [PAGE_URL.CALCULATE_LIST]: 'min-width-1400',
  [PAGE_URL.CALCULATE_POINT]: 'min-width-1400',
  [PAGE_URL.CALCULATE_COUPON]: 'min-width-1400',
  [PAGE_URL.CALCULATE_CLAIM]: 'min-width-1800',
  [PAGE_URL.CALCULATE_ETC]: 'min-width-1400',
  [PAGE_URL.CALCULATE_AFFILIATE]: 'min-width-1400',
  [PAGE_URL.ETC]: 'min-width-1600',
  [PAGE_URL.SALES_HISTORY]: 'min-width-2200',
  [PAGE_URL.SALES_STATISTIC]: 'min-width-2200',
  [PAGE_URL.MEMBERSHIP_EXTRA]: 'min-width-1600',
  [PAGE_URL.MEMBERSHIP_MONTHRANK]: 'min-width-1200',
  [PAGE_URL.EVENT]: 'min-width-1600',
} as Record<string, string>;

const Layout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const parentMenuPath = '/' + pathname.split('/')[1];

  return (
    <section className={`container ${CONTAINER_CLASS_NAME[pathname] || CONTAINER_CLASS_NAME[parentMenuPath] || ''}`}>
      <LayoutHeader />
      {children}
    </section>
  );
};

export default Layout;
