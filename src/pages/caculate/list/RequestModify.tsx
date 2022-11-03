import { FC } from "react";

interface RequestModifyProps {
    handlePopup: (key: string, value: boolean) => void
};
const RequestModify: FC<RequestModifyProps> = ({ handlePopup }) => {

    return (
        <div className="alert-layer modify-layer active">
            <div className="msg-wrap">
                <p className="title">수정요청</p>
                <textarea className="text-area" name="" id="" placeholder="수정 요청하실 품목과 금액 등 자세한 내용을 입력해주세요."></textarea>
                <button className="btn-close modify-close" onClick={() => handlePopup('requestModify', false)} ></button>
                <button className="cta-btn">등록하기</button>
            </div>
        </div>
    );
}

export default RequestModify;