import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();
    const buttonStyle = {
        width: '100px',
        height: '100px',
        backgroundColor: 'gray',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    };

    return (
        <div>
            <button style={buttonStyle} id="logoutButton" onClick={() => {
                // remove info from session
                localStorage.clear();
                // navigate back to login
                navigate("/")
            }}> LogoutButton </button>
        </div>
    );
};

export default LogoutButton;