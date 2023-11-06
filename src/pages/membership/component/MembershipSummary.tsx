import { FC, PropsWithChildren } from 'react';

// type, constants
import { MEMBERSHIP_SUMMARY_LIST } from 'constants/membership';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

interface MembershipSummaryProps extends PropsWithChildren {
  currentTab: MEMBERSHIP_PAGE_TYPE;
}
const MembershipSummary: FC<MembershipSummaryProps> = ({ currentTab, children }) => {
  return (
    <div className="contents">
      <div className="info-wrap">※{MEMBERSHIP_SUMMARY_LIST[currentTab].notice}</div>
      <div className="board-date-wrap">
        <p className="title bullet">
          {MEMBERSHIP_SUMMARY_LIST[currentTab].title}
          {MEMBERSHIP_SUMMARY_LIST[currentTab].bullets.map(({ children, className }, idx) => (
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
