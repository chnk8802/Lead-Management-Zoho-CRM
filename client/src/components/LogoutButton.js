import { useCallback } from "react";
import "./LogoutButton.css";

export const LogoutButton = ({ btnvalue }) => {
    const logout = useCallback(() => {
        window.catalyst.auth.signOut('/');
    }, []);
    return (
        <div id="logoutbtn" style={{padding: "5px", borderRadius: "50%"}}>
            <button onClick={logout} id="logout">
                {btnvalue.title}
            </button>
        </div>
    );
}