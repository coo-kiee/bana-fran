import { useLocation } from 'react-router-dom';

import { PAGE_URL, sideMenus } from '../sideMenubar/data/SideMenu';

const HEADER_CLASS_NAME = {
  [PAGE_URL.HOME]: 'home',
  [PAGE_URL.NOTICE]: 'notice',
  [PAGE_URL.BOARD]: 'dataroom',
  [PAGE_URL.CALCULATE]: 'calculate',
  [PAGE_URL.ETC]: 'etc',
  [PAGE_URL.SALES]: 'sales',
  [PAGE_URL.MEMBERSHIP]: 'membership',
  [PAGE_URL.EVENT]: 'event',
} as Record<string, string>;
const HIDE_CHILD_MENU_LIST = [PAGE_URL.EVENT_COUPON] as string[];

const LayoutHeader = () => {
  const { pathname } = useLocation();
  const parentMenuPath = '/' + pathname.split('/')[1];
  const childMenuPath = pathname.split('/')[2];
  const headerInfo: Record<string, string> = sideMenus.reduce(
    (arr1, cur1) => ({
      ...arr1,
      [cur1.path]: cur1.name,
      ...cur1.child.reduce((arr2, cur2) => ({ ...arr2, [cur1.path + cur2.path]: cur2.name }), {}),
    }),
    {},
  );

  return (
    <header>
      <div className={`page-title ${HEADER_CLASS_NAME[parentMenuPath] || ''}`}>
        <p className="present">{headerInfo[pathname] || headerInfo[parentMenuPath] || ''}</p>
        {!HIDE_CHILD_MENU_LIST.includes(pathname) && childMenuPath && (
          <p className="spot">{headerInfo[pathname] || ''}</p>
        )}
      </div>
    </header>
  );
};

export default LayoutHeader;
