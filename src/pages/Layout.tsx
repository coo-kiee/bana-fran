import React from 'react';
import SideMenubar from 'pages/common/sideMenubar';
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <SideMenubar />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout;