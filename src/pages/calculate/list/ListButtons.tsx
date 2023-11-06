import { UseQueryResult } from 'react-query';

// Type
import { CalculateLastMonthTotalQueryResult } from 'types/calculate/calculateType';

// Hook
import useModal from 'hooks/common/useModal';

// Const
import { LIST_STATUS } from 'constants/calculate/list';
import { IModalParams } from 'state/modal';
import CalculateConfirmModal from './modal/CalculateConfirmModal';
import RequestModifyModal from './modal/RequestModifyModal';
import ChangeHistoryModal from './modal/ChangeHistoryModal';

interface IListButtons {
  lastMonthTotalRes: UseQueryResult<CalculateLastMonthTotalQueryResult, unknown>;
}
const ListButtons = ({ lastMonthTotalRes }: IListButtons) => {
  const { openModal } = useModal();
  const calculateStatus = lastMonthTotalRes.data?.out.calculate_status || LIST_STATUS.ERROR;

  const hasData = ![LIST_STATUS.ERROR, LIST_STATUS.NO_DATA].includes(calculateStatus);
  const shouldConfirm = [LIST_STATUS.FIX_REQUEST, LIST_STATUS.NOT_CONFIRM].includes(calculateStatus);

  const handleOnClick = (type: 'Confirm' | 'Fix' | 'History') => {
    if (!lastMonthTotalRes.data?.out.calculate_id) return;

    let modalParams = {} as IModalParams;

    switch (type) {
      case 'Confirm':
        modalParams = {
          type: 'CUSTOM',
          component: (
            <CalculateConfirmModal
              calculateId={lastMonthTotalRes.data.out.calculate_id}
              refetchFn={lastMonthTotalRes.refetch}
            />
          ),
        };
        break;
      case 'Fix':
        modalParams = {
          type: 'CUSTOM',
          component: <RequestModifyModal calculateId={lastMonthTotalRes.data.out.calculate_id} />,
        };
        break;
      case 'History':
        modalParams = {
          type: 'CUSTOM',
          component: <ChangeHistoryModal calculateId={lastMonthTotalRes.data.out.calculate_id} />,
        };
        break;
      default:
        return;
    }

    openModal(modalParams);
  };

  return (
    <div className="btn-wrap">
      <button
        className={`btn-check ${shouldConfirm ? '' : 'inactive'}`}
        disabled={!shouldConfirm}
        onClick={() => handleOnClick('Confirm')}
      >
        정산확인
      </button>
      <button
        className={`btn-modify-request modify-view ${shouldConfirm ? '' : 'inactive'}`}
        disabled={!shouldConfirm}
        onClick={() => handleOnClick('Fix')}
      >
        수정요청
      </button>
      <button
        className={`btn-modify-history history-view ${hasData ? '' : 'inactive'}`}
        disabled={!hasData}
        onClick={() => handleOnClick('History')}
      >
        수정요청/변경이력
      </button>
    </div>
  );
};

export default ListButtons;
