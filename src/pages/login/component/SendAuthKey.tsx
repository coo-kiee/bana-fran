import { useEffect, useState } from 'react';

import LOGIN_SERVICE from 'service/loginService';

type Props = {
    loginID : string,
    loginPW : string,
    handleAuthKey : (param: any) => void,
    handleLoginAuth : (param: any) => void
}

// 인증시간 타이머
const Timer:React.FC<{endAuthTime : number}> = ({endAuthTime}) => {
    const [minutes, setMinutes] = useState<number>(2);
    const [seconds, setSeconds] = useState<number>(0);
  
    useEffect(() => {
        const countdown = setInterval(() => {
            const nowTime = Math.floor((endAuthTime - new Date().getTime()) / 1000);
            if (nowTime < 0) {
                clearInterval(countdown);
            } else {
                setMinutes(Math.floor(nowTime / 60));
                setSeconds(Math.floor(nowTime % 60));
            }
        }, 100);
      return () => clearInterval(countdown);
    }, [minutes, seconds, endAuthTime]);
  
    return (
        <p className="time-valid">
            { minutes === 0 && seconds === 0 ? 
                <span>인증시간이 초과 되었습니다.</span>
                : 
                <><span className="point">{minutes}</span>분<span className="point">{seconds}</span>초 남았습니다.</>
            }
        </p>
    )
}

const SendAuthKey:React.FC<Props> = (props) => {
    const { handleAuthKey, handleLoginAuth } = props
    const [endAuthTime, setEndAuthTime] = useState<number>(new Date().getTime() + 2 * 60 * 1000)
    const [authKey, setAuthKey] = useState<string>('');
    
    // 인증번호 전송.
    const useSendAuthKey = LOGIN_SERVICE.useSendAuthKey({
        sID : props.loginID,
        sPW : props.loginPW,
        sIP : "@ip"
    })

    // 인증번호 재발송.
    const reSendAuthKey = () => {
        useSendAuthKey.refetch();
        setEndAuthTime(new Date().getTime() + 2 * 60 * 1000)
    }

    return (
        <section className="auth-wrap">
            <div className="contents">
                <p className="description">휴대폰으로 수신된 인증번호를 입력해주세요.</p>
                <div className="input-wrap">
                    <input className="input number" placeholder="인증번호 입력" value={authKey} onChange={(e) => { setAuthKey(e.target.value)}}/>
                    <button className="resend" onClick={reSendAuthKey}>재발송</button>
                </div>
                <Timer endAuthTime={endAuthTime}/>
            </div>
            <div className="cta-btn-wrap">
                <button className="btn-close" onClick={() => handleAuthKey(false)}>취소</button>
                <button className="btn-check" onClick={() => handleLoginAuth(authKey)}>확인</button>
            </div>
        </section>
    )
}

export default SendAuthKey;