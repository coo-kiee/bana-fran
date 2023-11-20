import { FC } from 'react';

// component
import DeliveryChargeSummary from './DeliveryChargeSummary';
import DeliveryChargeDetail from './DeliveryChargeDetail';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const DeliveryCharge: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <div className="board-date-wrap">
      <DeliveryChargeSummary tabType={tabType} />
      <DeliveryChargeDetail tabType={tabType} />
    </div>
  );
};

export default DeliveryCharge;
