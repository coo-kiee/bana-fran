import { FC } from 'react';

// component
import RoyaltySummary from './RoyaltySummary';
import RoyaltyDetail from './RoyaltyDetail';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const Royalty: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <>
      <div className="board-date-wrap">
        <RoyaltySummary tabType={tabType} />
        <RoyaltyDetail tabType={tabType} />
      </div>
    </>
  );
};

export default Royalty;
