import { HomeNavbar, LoginNavbar } from "./navbar";
import { Outlet } from "react-router-dom";


export function Layout({isLoggedIn, username, onLogout }){
    return(
        <>
            {isLoggedIn ? <HomeNavbar username={username} onLogout={onLogout}/> : <LoginNavbar/>}
            <Outlet/>
        </>
    )
}