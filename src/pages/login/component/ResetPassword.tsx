import { useState, useCallback } from 'react';

import LOGIN_SERVICE from 'service/loginService';
import Utils from 'utils/Utils';

type Props = {
    loginID : string,
    handleSendTempPW : (param:any) => void
}

const ResetPassword:React.FC<Props> = (props) => {
    const { loginID, handleSendTempPW } = props;
    const [ phone, setPhone ] = useState<string>('');
    
    // 인증번호 전송. Mutation
    const sendPasswordMutation = LOGIN_SERVICE.useSendPassword(
        (error: any) => {
            console.log("인증번호 전송 오류", error)
        },
        (result: any) => {
            console.log(result)
            if(result.return === 1){
                alert("임시 비밀번호가 발송 되었습니다.")
                handleSendTempPW(false)
            }else{
                alert(result.out.sError);
            }
        }
    );

    // 임시비밀번호 발송.
    const handleSendSMS = useCallback(() => {
        if(loginID === ''){
            alert("아이디를 입력해 주세요.")
            return false
        }
        if(!Utils.phoneRegexp(phone)){
            alert("전화번호를 확인해 주세요.")
            return false
        }
        const params = {
            'sID' : loginID,
            'sPhone' : phone,
            'sIP' : '@ip'
        }
        sendPasswordMutation.mutate(params);
    }, [loginID, phone, sendPasswordMutation])

    return (
        <div className="alert-layer">
            <div className="msg-wrap">
                <p className="title">비밀번호 재설정</p>
                <div className="description">
                    <p>회원님의 아이디(전화번호)로 임시 비밀번호를 보내 드립니다.</p>
                    <p>임시 비밀번호로 로그인 하신 후 비밀번호를 변경 하시기 바랍니다.</p>
                </div>
                <div className="input-wrap">
                    <input className="input" type="number" value={phone} onChange={(e) => setPhone(e.target.value) } placeholder="전화번호" />
                    <button className="btn-pw-send" onClick={handleSendSMS}>임시 비밀번호 전송</button>
                </div>
                <button className="btn-close" onClick={() => handleSendTempPW(false)}></button>
            </div>
        </div>
    )
}

export default ResetPassword;