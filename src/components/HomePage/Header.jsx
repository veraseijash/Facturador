import { useNavigate } from "react-router-dom";
import { basePath } from '../../config';

export default function Header() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const image = storedUser?.image && !Array.isArray(storedUser.image)
        ? `${basePath}/public/images/${storedUser.image}`
        : `${basePath}/public/images/user.svg`;
    const navigate = useNavigate();
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("user"); // si usas token también
        navigate("/login");                // redirige al login
    };
    return (
        <div className="header-btn">
            <a className="btn-sign-in" onClick={handleLogout}>
                <img
                    src={image}
                    alt="User"
                    className="rounded-circle border"
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    />
                <span className="ms-1">Cerrar sesión</span>
            </a>
            <button type="button" className="btn btn-link btn-sm position-relative">
                <i className="bi bi-bell-fill" style={{ fontSize: "24px"}}></i>
                <span className="position-absolute top-0 start-90 translate-middle badge rounded-pill bg-danger ms-n2 mt-1">
                    4
                    <span className="visually-hidden">unread alerts</span>
                </span>
            </button>
        </div>
    );
}