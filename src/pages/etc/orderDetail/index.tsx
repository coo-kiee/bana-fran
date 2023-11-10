import { FC, useState } from 'react';
import loadable from '@loadable/component';

// component
import OrderDetailDetail from './OrderDetailDetail';
import OrderDetailSummary from './OrderDetailSummary';
import EtcOverallTable from '../component/EtcOverallTable';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const OrderDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const EtcOrderModal = loadable(() => import('./OrderDetailModal'));
  const [showOrderDetail, setShowOrderDetail] = useState({
    show: false,
    orderCode: 0,
  }); // 발주내역 세부 사항 모달 관련
  const openOrderDetailModal = (nOrderID: number) =>
    setShowOrderDetail((prev) => ({ ...prev, show: true, orderCode: nOrderID }));
  const closeOrderDetailModal = () => setShowOrderDetail((prev) => ({ ...prev, show: false, orderCode: 0 }));

  return (
    <>
      <div className="board-date-wrap">
        <EtcOverallTable tabType={tabType}>
          <OrderDetailSummary />
        </EtcOverallTable>
        <OrderDetailDetail openOrderDetailModal={openOrderDetailModal} tabType={tabType} />
      </div>
      {showOrderDetail.show ? (
        <EtcOrderModal showOrderDetail={showOrderDetail} closeOrderDetailModal={closeOrderDetailModal} />
      ) : null}
    </>
  );
};

export default OrderDetail;
