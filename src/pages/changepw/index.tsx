import { ChangeEvent, Fragment, useCallback, useState } from 'react';
// import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { loginState } from 'state';
import { useLogin } from 'hooks/useLogin';
import Utils from 'utils/Utils';
import CHANGE_PW_SERVICE from 'service/changepwService'
import SendAuthKey from './component/SendAuthKey';

type PasswordInfoType = {
    password : string,
    newPassword : string,
    newPasswordConfirm : string,
    msgType : number
}

const ChangePassword:React.FC = () => {
    // const navigator = useNavigate()
    const loginInfo = useRecoilValue(loginState)
    const {logout} = useLogin()

    const [passwordInfo, setPasswordInfo] = useState<PasswordInfoType>({
            password : '',
            newPassword : '',
            newPasswordConfirm : '',
            msgType : 0
    })
    const [pwAuthPage, setPwAuthPage] = useState<boolean>(false)
    const [confirmModalView, setConfirmModalView] = useState<boolean>(false)

    // 비밀번호 인증번호 발송. Mutation
    const sendPasswordAuthSMS = CHANGE_PW_SERVICE.useSendPasswordAuthSMS(
        (error: any) => {
            console.log("비밀번호 변경 인증 오류", error)
        },
        (result: any) => {
            if(result.return === 1){
                setPwAuthPage(true)
            }else{
                alert(result.out.sError);
            }
        }
    );

    // 비밀번호 변경처리. Mutation
    const saveChangePassword = CHANGE_PW_SERVICE.useSaveChangePassword(
        (error: any) => {
            console.log("비밀번호 변경 오류", error)
        },
        (result: any) => {
            if(result.return === 1){
                setConfirmModalView(true)
            }else{
                alert(result.out.sError);
            }
        }
    );

    // 데이터 변경.
    const handleDataChange = (e:ChangeEvent<HTMLInputElement>) => {
        let msgType:number = 0;
        if(e.target.name === 'newPassword'){
            if(!Utils.pwCheck(e.target.value)){
                msgType = 2
            }else{
                if(passwordInfo.newPasswordConfirm.length > 0 && passwordInfo.newPasswordConfirm !== e.target.value){
                    msgType = 3
                }else{
                    msgType = 1
                }
            }
        }else if(e.target.name === 'newPasswordConfirm'){
            if(Utils.pwCheck(passwordInfo.newPassword)){
                if(passwordInfo.newPassword === e.target.value){
                    msgType = 1
                }else{
                    msgType = 3
                }
            }else{
                msgType = 2
            }
        }
        setPasswordInfo({...passwordInfo, [e.target.name] : e.target.value, msgType : msgType})
    }

    // 메세지.
    const getMessage = (msgType:number) => {
        let rVal = ''
        switch(msgType){
            case 1 : rVal = '사용할 수 있는 비밀번호 입니다.' 
                     break
            case 2 : rVal = '사용할 수 없는 비밀번호 입니다.' 
                    break
            case 3 : rVal = '새 비밀번호와 일치하지 않습니다.' 
                    break
            case 4 : rVal = '새 비밀번호를 확인해 주세요.' 
                    break
            case 5 : rVal = '현재 비밀번호를 입력해 주세요.' 
                    break
            case 6 : rVal = '새 비밀번호를 입력해 주세요.' 
                    break
            default : break

        }
        return rVal
    }

    // 변경하기.(인증번호 발송)
    const handleSendAuthKey = () => {
        const { password, newPassword, newPasswordConfirm } = passwordInfo
        let msgType:number = 0
        if(password === ''){
            msgType = 5
        }else if(newPassword === ''){
            msgType = 6
        }else if(!Utils.pwCheck(newPassword)){
            msgType = 2
        }else if(newPassword !== newPasswordConfirm){
            msgType = 3
        }
        if(msgType > 0){
            setPasswordInfo({...passwordInfo, msgType : msgType })
        }else{
            const params = {
                sID : loginInfo.userInfo.login_id,
                sPW : password,
                sIP : '@ip'
            }
            sendPasswordAuthSMS.mutate(params)
        }
    }

    // 비밀번호 변경하기
    const handleChangePassword = (authKey:string) => {
        const params = {
            'web_login_id' : loginInfo.userInfo.login_id,
            'new_password' : passwordInfo.newPassword,
            'sAuthKey' : authKey,
            'sIP' : '@ip'
        }
        saveChangePassword.mutate(params)
    }

    // 변경완료 확인.
    const handleConfirm = useCallback(() => {
        // 변경 후 Home 이동.
        // navigator('/home')
        
        // 변경 후 재로그인 처리.
        const login_token = localStorage.getItem("login_token") !== null ? localStorage.getItem("login_token") : "";
        const params = {
            'sID' : "logout",
            'sPW' : "logout",
            'btoken' : 0,	         
            'sCToken' : login_token,       
            'sIP' : '@ip'
        }
        logout(params);
    }, [logout])

    return (
        <Fragment>
            <section className="container">
                <header>
                    <div className="page-title">
                        <p className="present">비밀번호 변경</p>
                    </div>    
                </header>
                {!pwAuthPage ? 
                    <section className="contents-wrap">
                        <div className="contents">
                            <p className="description">비밀번호는 영문/숫자/기호 포함 8자리 이상으로 설정 가능.</p>
                            <input className="input" type="password" name="password" onChange={handleDataChange} placeholder="현재 비밀번호" value={passwordInfo.password}/>
                            <input className="input" type="password" name="newPassword" onChange={handleDataChange} placeholder="새 비밀번호" value={passwordInfo.newPassword}/>
                            <input className="input" type="password" name="newPasswordConfirm" onChange={handleDataChange} placeholder="새 비밀번호 확인" value={passwordInfo.newPasswordConfirm}/>
                            <p className={`${passwordInfo.msgType !== 1 ? 'msg-warning' : ''}`}>{getMessage(passwordInfo.msgType)}</p>
                            <button className="btn-modify" onClick={handleSendAuthKey}>변경하기</button>
                        </div>
                    </section>
                    :
                    <SendAuthKey loginID={loginInfo.userInfo.login_id} loginPW={passwordInfo.password} handleReSendAuthKey={handleSendAuthKey} handleChangePassword={handleChangePassword} setPwAuthPage={setPwAuthPage}/>
                }
            </section>
            { confirmModalView &&
                <div className="alert-layer">
                    <div className="msg-wrap">
                        <p className="title">비밀번호 변경 완료!</p>
                        {/* <p>다시 로그인 하시기 바랍니다.</p> */}
                        <button className="btn-cta" onClick={handleConfirm}>확인</button>
                        <button className="btn-close" onClick={handleConfirm}></button>
                    </div>
                </div>
            }
        </Fragment>
    )
}

export default ChangePassword;