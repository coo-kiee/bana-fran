import { FC } from 'react';

// component
import GiftCardDetail from './GiftCardDetail';
import GiftCardSummary from './GiftCardSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const GiftCard: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <div className="board-date-wrap">
      <GiftCardSummary tabType={tabType} />
      <GiftCardDetail tabType={tabType} />
    </div>
  );
};

export default GiftCard;
