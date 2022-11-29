import { FC } from "react";

// API
import CALCULATE_SERVICE from 'service/calculateService';

// Hook
import { useEventKeyCode } from "hooks/useEventKeyCode";

interface CalculateConfirmModalProps {
    staffNo:number,
    calculateId:number,
    listQueryKey: string[] | undefined,
    handlePopup: (key: string, value: boolean) => void
};
const CalculateConfirmModal: FC<CalculateConfirmModalProps> = ({ staffNo, calculateId, listQueryKey, handlePopup }) => {

    const confirmList = CALCULATE_SERVICE.useCalculateConfirmList(staffNo, calculateId, listQueryKey as string[]);
    
    // 팝업창 닫기
    const closePopup = () => {
        handlePopup('calculateConfirm', false);
    };

    // 정산 확인하기
    const calculateConfirm = () => {
        confirmList();
        closePopup();
    };

    useEventKeyCode(closePopup, 'Escape');

    return (
        <div className="alert-layer modify-layer active">
            <div className="msg-wrap">
                <p className="title">정산확인 하시겠습니까?</p>
                <button className="btn-close modify-close" onClick={closePopup} ></button>
                <button className="cta-btn" style={{background: '#3a3a4d'}} onClick={closePopup}>취 소</button>&nbsp;&nbsp;
                <button className="cta-btn" style={{width:'153.22px', padding: '19px'}} onClick={calculateConfirm}>등록하기</button>
            </div>
        </div>
    );
}
 
export default CalculateConfirmModal;