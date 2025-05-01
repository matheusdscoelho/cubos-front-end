"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Spinner from "../../components/Spinner";
import { useLogin } from "@/lib/queries";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginData) => {
    setServerError("");

    try {
      const res = await loginMutation.mutateAsync(data);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        router.push("/movies");
      } else {
        setServerError("Token inválido ou ausente na resposta");
      }
    } catch (err) {
      type ErrorResponse = { response?: { data?: { error?: string } } };
      const errorMsg =
        (err as ErrorResponse)?.response?.data?.error || "Erro ao fazer login";
      setServerError(errorMsg);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/movies");
    }
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-xl shadow'
      >
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white'>
          Login
        </h2>

        {serverError && (
          <p className='text-red-500 text-sm mb-4 text-center'>{serverError}</p>
        )}

        <div className='mb-4'>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            E-mail
          </label>
          <input
            type='email'
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            {...register("email")}
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div className='mb-6'>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            Senha
          </label>
          <input
            type='password'
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            {...register("password")}
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={loginMutation.isPending}
          className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50 flex items-center justify-center gap-2'
        >
          {loginMutation.isPending && <Spinner />}
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </button>

        <div className='mt-4 text-center'>
          <span className='text-sm text-gray-600 dark:text-gray-300'>
            Ainda não tem uma conta?
          </span>{" "}
          <Link
            href='/register'
            className='text-blue-600 hover:underline dark:text-blue-400'
          >
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}
