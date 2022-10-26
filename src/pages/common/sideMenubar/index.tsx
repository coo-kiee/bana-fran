import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { sideMenus, SIDE_MENU_TYPE } from "./data/SideMenu";
import { useNavigate } from "react-router-dom";
import Utils from 'utils/Utils';

import LOGIN_SERVICE from 'service/loginService';

type SideMenuBarType = {
    index : number,
    subIndex : number
}

const SideMenu:React.FC<{activeMenu:SideMenuBarType, sideMenus:Array<SIDE_MENU_TYPE>, setActiveMenu:React.Dispatch<React.SetStateAction<SideMenuBarType>>}> = ({activeMenu, sideMenus, setActiveMenu}) => {
    
    const handleMenuClick = (index:number) => {
        setActiveMenu({ index : index,  subIndex : -1})
    }

    const handleSubMenuClick = (subIndex:number) => {
        setActiveMenu({...activeMenu, subIndex : subIndex})
    }

    return (
        <Fragment>
            {
            sideMenus.map((data:SIDE_MENU_TYPE, key) => {
                const childMenu = data.child?.map((subData, ckey) => 
                    <div key={`link_${ckey}`}  className="menu-sub-item" onClick={() => handleSubMenuClick(subData.id)}>- {subData.name}  {activeMenu.subIndex === subData.id ? '[선택]' : ''}</div>
                );

                const childLen = data.child?.length || 0
                return (childLen > 0 ? 
                        <div  className="menu-item" key={`menu_${key}`}>
                            <div onClick={() => handleMenuClick(data.id) } className="menu-title">
                                {data.name}  {activeMenu.index === data.id ? '[SHOW]' : '[HIDE]'}
                                {/* <Icon name={data.icon}/> {prdataop.name}   { data.child.length > 0 ? <Icon name='dropdown' /> : null } */}
                            </div>
                            {childMenu}
                        </div> 
                    :
                    <div key={`link_${key}`}  className="menu-sub-item" onClick={() => handleMenuClick(data.id)}> {data.name}  {activeMenu.index === data.id ? '[선택]' : ''}</div>
                )
            })}
        </Fragment>
    )
}

const SideMenubar:React.FC = () => {
    const navigate = useNavigate()

    const [activeMenu, setActiveMenu] = useState<SideMenuBarType>({
        index: -1 ,
        subIndex : -1
    })

    // 로그아웃 Mutation
    const logoutMutation = LOGIN_SERVICE.useLogout(
        (error: any) => {
            console.log("로그아웃 오류", error)
        },
        (result: any, variables : any) => {
            Utils.removeToken();
            navigate("/");
        }
    );

    // 메뉴활성화 처리.
    useEffect(() => {
        // URL로 바로 접속 시 side menu 처리.
        if( window.location.pathname !== "/"){
            let menuData:{pId : number, id : number} = { pId : 0, id : 0 };
            sideMenus.forEach((data:SIDE_MENU_TYPE) => {
                if(data.path === window.location.pathname) menuData = {...data, pId : data.id }
                else {
                    data.child?.forEach(cdata => {
                        if(cdata.path === window.location.pathname) menuData = {...cdata, pId : data.id }
                    });
                }
            })
            setActiveMenu({index: menuData.pId, subIndex:menuData.id})
        }
    }, [])

    // 로그아웃.
    const handleLogOut = useCallback(() => {
        const login_token = localStorage.getItem("login_token") !== null ? localStorage.getItem("login_token") : "";
        const params = {
            'sID' : "logout",
            'sPW' : "logout",
            'btoken' : 0,	         
            'sCToken' : login_token,       
            'sIP' : '@ip'
        }
        logoutMutation.mutate(params);
    }, [logoutMutation])

    console.log("SIDE MENU BAR RENDER!!")

    return(
        <>
            <div className="sub-side-top">
                {/* <img src='/img/common/logo.png' /> */}
                <p>가맹점 사이트</p>
                <p><b>{localStorage.getItem("userNm")}</b>님 안녕하세요.</p>
            </div>
            <SideMenu activeMenu={activeMenu} sideMenus={sideMenus} setActiveMenu={setActiveMenu}/>

            {/* 로그아웃 */}
            <button onClick={handleLogOut} >로그아웃</button>
        </>
    )
} 

export default SideMenubar