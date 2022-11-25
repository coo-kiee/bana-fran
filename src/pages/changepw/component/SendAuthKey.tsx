import { useEffect, useState } from 'react'; 

type Props = {
    loginID : string,
    loginPW : string,
    handleReSendAuthKey : () => void,
    handleChangePassword : (param: any) => void,
    setPwAuthPage : (param: any) => void
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
    const { handleReSendAuthKey, handleChangePassword, setPwAuthPage } = props
    const [endAuthTime, setEndAuthTime] = useState<number>(new Date().getTime() + 2 * 60 * 1000)
    const [authKey, setAuthKey] = useState<string>('');
    
    // 인증번호 재발송.
    const reSendAuthKey = () => {
        handleReSendAuthKey()
        setEndAuthTime(new Date().getTime() + 2 * 60 * 1000)
    }

    // 인증번호 확인.
    const checkPasswordAuthKey = () => {
        if(endAuthTime < new Date().getTime()){
            alert("인증시간이 초과 되었습니다.")
        }else{
            handleChangePassword(authKey)
        }
    }

    return (
        <section className="contents-wrap">
            <div className="contents">
                <p className="description">휴대폰으로 수신된 인증번호를 입력해주세요.</p>
                <div className="input-wrap">
                    <input className="input number" placeholder="인증번호" value={authKey} onChange={(e) => { setAuthKey(e.target.value)}}/>
                    <button className="resend" onClick={reSendAuthKey}>재발송</button>
                </div>
                <Timer endAuthTime={endAuthTime}/>
                <div className="cta-btn-wrap pw_auth_number">
                    <button className="btn-close" onClick={() => setPwAuthPage(false)}>취소</button>
                    <button className="btn-check" onClick={checkPasswordAuthKey}>확인</button>
                </div>
            </div>
        </section>
    )
}

export default SendAuthKey;