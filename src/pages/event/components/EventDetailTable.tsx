import { FC } from 'react';

// type, constants
import { EVENT_TAB_TITLE, EventTabType } from 'constants/event';

interface EventDetailTableProps {
  tabType: EventTabType;
}

const EventDetailTable: FC<EventDetailTableProps> = ({ tabType }) => {
  return (
    <tbody>
      <tr>
        <td colSpan={20}>{EVENT_TAB_TITLE[tabType]} 데이터 준비중입니다.</td>
      </tr>
    </tbody>
  );
};

export default EventDetailTable;
