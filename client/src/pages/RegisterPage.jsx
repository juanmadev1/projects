import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import backgroundImage from "../assets/foto_comidas.jpg";
import { Navbar } from "../components/Navbar"; // Importa el componente Navbar

function Register() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    await signup(value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex-grow flex flex-col items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            zIndex: -1,
          }}
        />
        <div className="z-10 w-full max-w-md px-6 py-8">
          <Card className="bg-white bg-opacity-80">
            {registerErrors.map((error, i) => (
              <Message message={error} key={i} />
            ))}
            <h1 className="text-3xl font-bold mb-6 text-center">Registro</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="username">Nombre de usuario:</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Escribe tu nombre"
                  {...register("username")}
                  autoFocus
                />
                {errors.username?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.username?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico:</Label>
                <Input
                  name="email"
                  placeholder="tucorreo@dominio.com"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña:</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Contraseña:</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="********"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
                )}
              </div>

              <Button className="w-full">Registrarse</Button>
            </form>
            <p className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link className="text-blue-500 hover:underline" to="/login">
                Iniciar sesión
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Register;
