// component
import EtcOverallTable from '../component/EtcOverallTable';
import GiftCardDetail from './GiftCardDetail';
import GiftCardSummary from './GiftCardSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const GiftCard = () => {
  return (
    <div className="board-date-wrap">
      <EtcOverallTable currentTab={ETC_TAB_TYPE.GIFTCARD}>
        <GiftCardSummary />
      </EtcOverallTable>
      <GiftCardDetail />
    </div>
  );
};

export default GiftCard;
