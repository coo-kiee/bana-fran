import { FC } from "react";

// API
import CALCULATE_SERVICE from 'service/calculateService';

// Hook
import { useEventKeyCode } from "hooks/useEventKeyCode";

interface CalculateConfirmModalProps {
    staffNo: number,
    calculateId: number,
    listRefetchFn: () => Promise<void>
    handlePopup: (key: string, value: boolean) => void,
};
const CalculateConfirmModal: FC<CalculateConfirmModalProps> = ({ staffNo, calculateId, listRefetchFn, handlePopup }) => {

    
    // 팝업창 닫기
    const closePopup = () => {
        handlePopup('calculateConfirm', false);
    };

    // 정산확인
    const calculateConfirmMutation = CALCULATE_SERVICE.useCalculateConfirm(staffNo, calculateId, listRefetchFn, closePopup);

    useEventKeyCode(closePopup, 'Escape');

    return (
        <div className="alert-layer modify-layer active">
            <div className="msg-wrap">
                <p className="title">정산확인 하시겠습니까?</p>
                <button className="btn-close modify-close" onClick={closePopup} ></button>
                <button className="cta-btn" style={{ background: '#3a3a4d' }} onClick={closePopup}>취 소</button>&nbsp;&nbsp;
                <button className="cta-btn" onClick={() => calculateConfirmMutation.mutateAsync()}>확 인</button>
            </div>
        </div>
    );
}

export default CalculateConfirmModal;