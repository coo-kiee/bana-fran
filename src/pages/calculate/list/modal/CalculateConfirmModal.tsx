// API
import { useCalculateConfirm } from 'service/calculateService';

// Hook
import useModal from 'hooks/common/useModal';
import useUserInfo from 'hooks/user/useUser';

interface ICalculateConfirmModal {
  calculateId: number;
  refetchFn: Function;
}
const CalculateConfirmModal = ({ calculateId, refetchFn }: ICalculateConfirmModal) => {
  const { user } = useUserInfo();

  const { popModal, openModal } = useModal();

  // Mutation
  const { mutateAsync: confirmCalculate } = useCalculateConfirm();

  const handleConfirm = async () => {
    await confirmCalculate({
      calculate_id: calculateId,
      login_staff_no: user.staffNo,
    });

    await refetchFn();

    popModal();

    openModal({
      type: 'Alert',
      component: <>정산확인을 했습니다.</>,
    });
  };

  return (
    <div className="alert-layer modify-layer active">
      <div className="msg-wrap">
        <p className="title">정산확인 하시겠습니까?</p>
        <button className="btn-close modify-close" onClick={popModal}></button>
        <button className="cta-btn" onClick={handleConfirm}>
          확 인
        </button>
        &nbsp;&nbsp;
        <button className="cta-btn" style={{ background: '#3a3a4d' }} onClick={popModal}>
          취 소
        </button>
      </div>
    </div>
  );
};

export default CalculateConfirmModal;
