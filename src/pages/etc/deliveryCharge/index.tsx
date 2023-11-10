import { FC } from 'react';

// component
import EtcOverallTable from '../component/EtcOverallTable';
import DeliveryChargeSummary from './DeliveryChargeSummary';
import DeliveryChargeDetail from './DeliveryChargeDetail';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const DeliveryCharge: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <div className="board-date-wrap">
      <EtcOverallTable tabType={tabType}>
        <DeliveryChargeSummary />
      </EtcOverallTable>
      <DeliveryChargeDetail tabType={tabType} />
    </div>
  );
};

export default DeliveryCharge;
