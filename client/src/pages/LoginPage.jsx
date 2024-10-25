import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import backgroundImage from "../assets/foto_comidas.jpg";  // Importa la imagen

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            zIndex: -1,
          }}
        />
        <div className="absolute inset-0 " /> {/* Capa de oscurecimiento */}
        <div className="z-10 w-full max-w-md px-6 py-8">
          <Card className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm">
            {loginErrors.map((error, i) => (
              <Message message={error} key={i} />
            ))}
            <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico:</Label>
                <Input
                  label="Escribe tu correo electrónico"
                  type="email"
                  name="email"
                  placeholder="tucorreo@dominio.com"
                  {...register("email", { required: true })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Contraseña:</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Escribe tu contraseña"
                  {...register("password", { required: true, minLength: 6 })}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <Button className="w-full">Iniciar sesión</Button>
            </form>

            <p className="mt-4 text-center text-sm">
              ¿No tienes una cuenta? <Link to="/register" className="text-blue-500 hover:underline">Regístrate</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );

}
