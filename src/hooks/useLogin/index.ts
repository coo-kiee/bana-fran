import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import LOGIN_SERVICE from 'service/loginService';

// Global State
import { loginState, franState } from 'state';

// 로그인 hooks
export const useLogin = () => {
  const navigate = useNavigate();
  const setLoginAuth = useSetRecoilState(loginState);
  const setFranCode = useSetRecoilState(franState);

  // 인증키 로그인 Mutation
  const { mutate: authLoginMutation } = LOGIN_SERVICE.useAuthLogin(
    (error: any) => {
      console.log('로그인 오류', error);
    },
    (result: any, variables: any) => {
      if (result?.out?.sError === '' && result?.out?.nFCode !== -1) {
        if (result?.out?.sToken !== null) setToken(result?.out?.sToken);
        localStorage.setItem('userID', result?.out?.sLoginID);
        localStorage.setItem('userNm', result?.out?.sName);
        localStorage.setItem('userNo', result?.out?.nSNo);

        // 패스워드 8자리 체크.
        const pwLenth = result?.out?.sLoginPWLen || 10;

        setLoginAuth({
          isLogin: true,
          userInfo: {
            staff_no: result?.out?.nSNo,
            staff_name: result?.out?.sName,
            login_id: result?.out?.sLoginID,
            f_list: result?.list,
          },
        });

        if (result?.list.length > 0) setFranCode(result?.list[0].f_code | 0);
        if (pwLenth < 8) navigate('/password_change');
        else if (window.location.pathname === '/index') navigate('/home');
      } else {
        removeToken();
        setFranCode(0);
        localStorage.removeItem('sUserID');
        alert(result?.out?.sError);
      }
    },
  );

  // 로그인 Mutation
  const { mutate: loginMutation } = LOGIN_SERVICE.useLogin(
    (error: any) => {
      console.log('로그인 오류', error);
    },
    (result: any, variables: any) => {
      if (result?.out?.sError === '' && result?.out?.nFCode !== -1) {
        if (result?.out?.sToken !== null) setToken(result?.out?.sToken);
        localStorage.setItem('userID', result?.out?.sLoginID);
        localStorage.setItem('userNm', result?.out?.sName);
        localStorage.setItem('userNo', result?.out?.nSNo);

        setLoginAuth({
          isLogin: true,
          userInfo: {
            staff_no: result?.out?.nSNo,
            staff_name: result?.out?.sName,
            login_id: result?.out?.sLoginID,
            f_list: result?.list,
          },
        });

        if (result?.list.length > 0) setFranCode(result?.list[0].f_code | 0);
        if (window.location.pathname === '/index') navigate('/home');
      } else {
        removeToken();
        setFranCode(0);
        localStorage.removeItem('sUserID');
        alert(result?.out?.sError);
      }
    },
  );

  // 로그아웃 Mutation
  const { mutate: logoutMutation } = LOGIN_SERVICE.useLogout(
    (error: any) => {
      console.log('로그아웃 오류', error);
    },
    (result: any) => {
      removeToken();
      setLoginAuth({
        isLogin: false,
        userInfo: {
          staff_no: result?.out?.nSNo,
          staff_name: result?.out?.sName,
          login_id: result?.out?.sLoginID,
          f_list: result?.list,
        },
      });
      setFranCode(0);
      navigate('/');
    },
  );

  const authLogin = useCallback(
    (params: any) => {
      authLoginMutation(params);
    },
    [authLoginMutation],
  );

  const login = useCallback(
    (params: any) => {
      loginMutation(params);
    },
    [loginMutation],
  );

  const logout = useCallback(
    (params: any) => {
      logoutMutation(params);
    },
    [logoutMutation],
  );

  const setToken = useCallback((sToken: string) => {
    sessionStorage.setItem('login_token', sToken);
  }, []);

  const removeToken = useCallback(() => {
    sessionStorage.removeItem('login_token');
    localStorage.removeItem('userID');
    localStorage.removeItem('userNm');
    localStorage.removeItem('userNo');
  }, []);

  const chkToken = useCallback(() => {
    if (
      sessionStorage.getItem('login_token') === null ||
      sessionStorage.getItem('login_token') === 'null' ||
      sessionStorage.getItem('login_token') === ''
    ) {
      return false;
    } else {
      return true;
    }
  }, []);

  const getToken = useCallback(() => {
    return sessionStorage.getItem('login_token');
  }, []);

  return { authLogin, login, logout, chkToken, getToken, removeToken };
};
