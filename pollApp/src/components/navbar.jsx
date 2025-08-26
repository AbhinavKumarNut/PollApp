import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png';
export function LoginNavbar() {
    return (
        <nav className="bg-gray-800 shadow-lg p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="My App Logo" className="h-8 w-8" />
                    <Link to="/">
                        <span className="text-xl text-white font-semibold tracking-wider">Poll App</span>
                    </Link>
                </div>
                <div className="flex space-x-6">
                    <Link to="/login">
                        <button className="text-gray-300 hover:text-white font-medium py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="text-gray-300 hover:text-white font-medium py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export function HomeNavbar({ onLogout }) {
    const navigate = useNavigate();
    const logoutHandler = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 shadow-lg p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="My App Logo" className="h-8 w-8" />
                    <span className="text-xl text-white font-semibold tracking-wider">Poll App</span>
                </div>
                <div className="flex space-x-6">
                    <Link to="/home">
                        <button className="text-gray-300 hover:text-white font-medium py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Home
                        </button>
                    </Link>
                    <Link to="/create">
                        <button className="text-gray-300 hover:text-white font-medium py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Create Poll
                        </button>
                    </Link>
                    <Link to="/mypolls">
                        <button className="text-gray-300 hover:text-white font-medium py-2 px-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            My Polls
                        </button>
                    </Link>
                </div>
                <button
                    onClick={logoutHandler}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-6 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}