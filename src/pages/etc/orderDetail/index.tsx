import { FC } from 'react';

// component
import OrderDetailDetail from './OrderDetailDetail';
import OrderDetailSummary from './OrderDetailSummary';
import EtcOverallTable from '../component/EtcOverallTable';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const OrderDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <>
      <div className="board-date-wrap">
        <EtcOverallTable tabType={tabType}>
          <OrderDetailSummary />
        </EtcOverallTable>
        <OrderDetailDetail tabType={tabType} />
      </div>
    </>
  );
};

export default OrderDetail;
