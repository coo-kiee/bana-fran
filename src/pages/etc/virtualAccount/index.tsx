// component
import EtcOverallTable from '../component/EtcOverallTable';
import VirtualAccountDetail from './VirtualAccountDetail';
import VirtualAccountSummary from './VirtualAccountSummary';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const VirtualAccount = () => {
  return (
    <>
      <div className="board-date-wrap">
        <EtcOverallTable currentTab={ETC_TAB_TYPE.ACCOUNT}>
          <VirtualAccountSummary />
        </EtcOverallTable>
        <VirtualAccountDetail />
      </div>
    </>
  );
};

export default VirtualAccount;
