// component
import EtcOverallTable from '../component/EtcOverallTable';
import DeliveryChargeSummary from './DeliveryChargeSummary';
import DeliveryChargeDetail from './DeliveryChargeDetail';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const DeliveryCharge = () => {
  return (
    <div className="board-date-wrap">
      <EtcOverallTable currentTab={ETC_TAB_TYPE.DELIVERY}>
        <DeliveryChargeSummary />
      </EtcOverallTable>
      <DeliveryChargeDetail />
    </div>
  );
};

export default DeliveryCharge;
