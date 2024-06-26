import { FC } from 'react';

// type, constant
import { MEMBERSHIP_COL_THEAD_LIST } from 'constants/membership';

// component
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Table from 'pages/common/table';

// type
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

interface MembershipDetailTableFallbackProps {
  pageType: MEMBERSHIP_PAGE_TYPE;
  resetErrorBoundary?: () => void;
}

const MembershipDetailTableFallback: FC<MembershipDetailTableFallbackProps> = ({ pageType, resetErrorBoundary }) => {
  return (
    <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
      <Table.ColGroup colGroupAttributes={MEMBERSHIP_COL_THEAD_LIST[pageType].colgroup} />
      <Table.TableHead thData={MEMBERSHIP_COL_THEAD_LIST[pageType].thead} />
      <tbody>
        <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
      </tbody>
    </Table>
  );
};

export default MembershipDetailTableFallback;
