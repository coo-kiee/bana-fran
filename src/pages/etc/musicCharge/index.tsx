// component
import EtcOverallTable from '../component/EtcOverallTable';
import MusicChargeDetail from './MusicChargeDetail';
import MusicChargeSummary from './MusicChargeSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const MusicCharge = () => {
  return (
    <div className="board-date-wrap">
      <EtcOverallTable currentTab={ETC_TAB_TYPE.MUSIC}>
        <MusicChargeSummary />
      </EtcOverallTable>
      <MusicChargeDetail />
    </div>
  );
};

export default MusicCharge;
