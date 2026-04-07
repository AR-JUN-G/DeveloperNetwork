import { Outlet } from "react-router";
import AppSidebar from "../AppSidebar/AppSidebar";
import "../AppSidebar/AppSidebar.css"; 

const AppLayout = () => {
    return (
        <div className="main-app-layout">
            <AppSidebar />
            <main className="layout-content-wrapper">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
