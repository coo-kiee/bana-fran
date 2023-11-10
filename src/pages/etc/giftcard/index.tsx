import { FC } from 'react';

// component
import EtcOverallTable from '../component/EtcOverallTable';
import GiftCardDetail from './GiftCardDetail';
import GiftCardSummary from './GiftCardSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const GiftCard: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <div className="board-date-wrap">
      <EtcOverallTable tabType={tabType}>
        <GiftCardSummary />
      </EtcOverallTable>
      <GiftCardDetail tabType={tabType} />
    </div>
  );
};

export default GiftCard;
