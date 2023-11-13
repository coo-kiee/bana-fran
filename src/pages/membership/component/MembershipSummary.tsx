import { FC, PropsWithChildren } from 'react';

// type, constants
import { MEMBERSHIP_SUMMARY_LIST } from 'constants/membership';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

interface MembershipSummaryProps extends PropsWithChildren {
  pageType: MEMBERSHIP_PAGE_TYPE;
}
const MembershipSummary: FC<MembershipSummaryProps> = ({ pageType, children }) => {
  return (
    <div className="contents">
      <div className="info-wrap">※{MEMBERSHIP_SUMMARY_LIST[pageType].notice}</div>
      <div className="board-date-wrap">
        <p className="title bullet">
          {MEMBERSHIP_SUMMARY_LIST[pageType].title}
          {MEMBERSHIP_SUMMARY_LIST[pageType].bullets.map(({ children, className }, idx) => (
            <span key={idx} className={className}>
              {children}
            </span>
          ))}
        </p>
        {children}
      </div>
    </div>
  );
};

export default MembershipSummary;
