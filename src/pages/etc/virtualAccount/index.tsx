import { FC } from 'react';

// component
import EtcOverallTable from '../component/EtcOverallTable';
import VirtualAccountDetail from './VirtualAccountDetail';
import VirtualAccountSummary from './VirtualAccountSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const VirtualAccount: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <>
      <div className="board-date-wrap">
        <EtcOverallTable tabType={tabType}>
          <VirtualAccountSummary />
        </EtcOverallTable>
        <VirtualAccountDetail tabType={tabType} />
      </div>
    </>
  );
};

export default VirtualAccount;
