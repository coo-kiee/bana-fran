import { FC } from 'react';

// component
import RoyaltySummary from './RoyaltySummary';
import RoyaltyDetail from './RoyaltyDetail';
import EtcOverallTable from '../component/EtcOverallTable';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const Royalty: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <>
      <div className="board-date-wrap">
        <EtcOverallTable tabType={tabType}>
          <RoyaltySummary />
        </EtcOverallTable>
        <RoyaltyDetail tabType={tabType} />
      </div>
    </>
  );
};

export default Royalty;
