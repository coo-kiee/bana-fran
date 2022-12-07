import { ChangeEventHandler, FC, useState } from "react";

// API
import CALCULATE_SERVICE from 'service/calculateService';

interface RequestModifyModalProps {
    staffNo:number,
    calculateId:number,
    handlePopup: (key: string, value: boolean) => void,
};
const RequestModifyModal: FC<RequestModifyModalProps> = ({ staffNo, calculateId, handlePopup }) => {

    // 수정내용
    const [comment, setComment] = useState('');
    const handleComment:ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const value = e.currentTarget.value;
        setComment(prev => value);
    };

    // 팝업창 닫기
    const closePopup = () => {
        handlePopup('requestModify', false);
    };

    // 수정요청
    const requestFixMutation = CALCULATE_SERVICE.useCalculateRequestFix(staffNo, calculateId, comment, closePopup);

    return (
        <div className="alert-layer modify-layer active">
            <div className="msg-wrap">
                <p className="title">수정요청</p>
                <textarea className="text-area" name="" id="" placeholder="수정 요청하실 품목과 금액 등 자세한 내용을 입력해주세요." value={comment} onChange={handleComment}></textarea>
                <button className="btn-close modify-close" onClick={() => handlePopup('requestModify', false)} ></button>
                <button className="cta-btn" onClick={() => requestFixMutation.mutateAsync()}>등록하기</button>
            </div>
        </div>
    );
}

export default RequestModifyModal;