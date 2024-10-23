import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";
import logoImage from "../assets/logo.png"; // Asegúrate de que la ruta sea correcta

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  console.log(isAuthenticated, user)

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/');
    } else {
      console.error("Error al cerrar sesión");
    }
  };

  return (
    <nav className="bg-orange-600 my-3 flex justify-between items-center py-5 px-10 rounded-lg">
      <div className="flex items-center">
        <img src={logoImage} alt="FoodIn Logo" className="h-8 w-auto mr-2" /> {/* Ajusta el tamaño según necesites */}
        <h1 className="text-2xl font-bold">
          <Link to="/">FoodIn</Link>
        </h1>
      </div>
      <ul className="flex gap-x-2 items-center">
        {isAuthenticated ? (
          <>
            <li className="text-white">
              Bienvenido {user.username}
            </li>
            <li>
              <ButtonLink to="/">Inicio</ButtonLink>
            </li>
            <li>
              <ButtonLink to="/tasks">Mi Negocio</ButtonLink>
            </li>
            <li>
              <ButtonLink to="/add-task">Añadir Negocio</ButtonLink>
            </li>
            <li>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <ButtonLink to="/login">Iniciar Sesión</ButtonLink>
            </li>
            <li>
              <ButtonLink to="/register">Registrarse</ButtonLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
