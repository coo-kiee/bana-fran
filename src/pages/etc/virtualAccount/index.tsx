import { FC } from 'react';

// component
import VirtualAccountDetail from './VirtualAccountDetail';
import VirtualAccountSummary from './VirtualAccountSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const VirtualAccount: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <>
      <div className="board-date-wrap">
        <VirtualAccountSummary tabType={tabType} />
        <VirtualAccountDetail tabType={tabType} />
      </div>
    </>
  );
};

export default VirtualAccount;
