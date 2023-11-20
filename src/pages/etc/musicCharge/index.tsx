import { FC } from 'react';

// component
import MusicChargeDetail from './MusicChargeDetail';
import MusicChargeSummary from './MusicChargeSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const MusicCharge: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <div className="board-date-wrap">
      <MusicChargeSummary tabType={tabType} />
      <MusicChargeDetail tabType={tabType} />
    </div>
  );
};

export default MusicCharge;
