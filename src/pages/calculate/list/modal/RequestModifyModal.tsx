import { FC, useState } from 'react';

// Hook
import useModal from 'hooks/common/useModal';
import useUserInfo from 'hooks/user/useUser';
import useOnChange from 'hooks/useOnChange';

// API
import { useCalculateRequestFix } from 'service/calculateService';

interface IRequestModifyModal {
  calculateId: number;
}
const RequestModifyModal: FC<IRequestModifyModal> = ({ calculateId }) => {
  const { user } = useUserInfo();

  const { popModal, openModal } = useModal();

  // 수정내용
  const [comment, setComment] = useState('');
  const handleComment = useOnChange(setComment);

  // 수정요청
  const { mutateAsync: requestFix } = useCalculateRequestFix();

  const handleRegister = async () => {
    await requestFix({
      calculate_id: calculateId,
      login_staff_no: user.staffNo,
      comment,
    });

    popModal();

    openModal({
      type: 'Alert',
      component: <>정산확인을 했습니다.</>,
    });
  };

  return (
    <div className="alert-layer modify-layer active">
      <div className="msg-wrap">
        <p className="title">수정요청</p>
        <textarea
          className="text-area"
          name=""
          id=""
          placeholder="수정 요청하실 품목과 금액 등 자세한 내용을 입력해주세요."
          value={comment}
          onChange={handleComment}
        ></textarea>
        <button className="btn-close modify-close" onClick={popModal}></button>
        <button className="cta-btn" onClick={handleRegister}>
          등록하기
        </button>
      </div>
    </div>
  );
};

export default RequestModifyModal;
