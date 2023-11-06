// component
import RoyaltySummary from './RoyaltySummary';
import RoyaltyDetail from './RoyaltyDetail';
import EtcOverallTable from '../component/EtcOverallTable';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const Royalty = () => {
  return (
    <>
      <div className="board-date-wrap">
        <EtcOverallTable currentTab={ETC_TAB_TYPE.ROYALTY}>
          <RoyaltySummary />
        </EtcOverallTable>
        <RoyaltyDetail />
      </div>
    </>
  );
};

export default Royalty;
