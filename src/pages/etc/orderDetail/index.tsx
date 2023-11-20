import { FC } from 'react';

// component
import OrderDetailDetail from './OrderDetailDetail';
import OrderDetailSummary from './OrderDetailSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const OrderDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <>
      <div className="board-date-wrap">
        <OrderDetailSummary tabType={tabType} />
        <OrderDetailDetail tabType={tabType} />
      </div>
    </>
  );
};

export default OrderDetail;
