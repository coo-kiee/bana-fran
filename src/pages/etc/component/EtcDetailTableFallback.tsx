import { FC } from 'react';

// type, constants
import { ETC_TAB_TYPE } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST } from 'constants/etc';

// component
import Table from 'pages/common/table';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

interface EtcDetailTableFallbackProps {
  tabType: ETC_TAB_TYPE;
  resetErrorBoundary?: () => void;
}
const EtcDetailTableFallback: FC<EtcDetailTableFallbackProps> = ({ tabType, resetErrorBoundary }) => {
  return (
    <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
      <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
      <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} />
      <tbody>
        <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
      </tbody>
    </Table>
  );
};

export default EtcDetailTableFallback;
