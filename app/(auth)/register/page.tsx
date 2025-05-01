"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../../components/Spinner";
import { useRegister, useLogin } from "@/lib/queries";

const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const registerMutation = useRegister();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");

    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const res = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      const token = res.data?.token;

      if (!token) {
        setServerError("Erro ao obter token após login");
        return;
      }

      localStorage.setItem("token", token);
      router.push("/movies");
    } catch (err) {
      type ErrorResponse = { response?: { data?: { error?: string } } };
      const errorMsg =
        (err as ErrorResponse)?.response?.data?.error || "Erro ao fazer login";
      setServerError(errorMsg);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        <h1 className='text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white'>
          Criar Conta
        </h1>

        {serverError && (
          <p className='text-red-500 mb-4 text-center'>{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Nome
            </label>
            <input
              {...register("name")}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600'
            />
            {errors.name && (
              <p className='text-red-500 text-sm'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              E-mail
            </label>
            <input
              type='email'
              {...register("email")}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600'
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Senha
            </label>
            <input
              type='password'
              {...register("password")}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600'
            />
            {errors.password && (
              <p className='text-red-500 text-sm'>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Confirmar Senha
            </label>
            <input
              type='password'
              {...register("confirmPassword")}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600'
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={
              isSubmitting ||
              registerMutation.isPending ||
              loginMutation.isPending
            }
            className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {(registerMutation.isPending || loginMutation.isPending) && (
              <Spinner />
            )}
            {registerMutation.isPending || loginMutation.isPending
              ? "Registrando..."
              : "Registrar"}
          </button>

          <div className='mt-4 text-center'>
            <span className='text-sm text-gray-600 dark:text-gray-300'>
              Já tem uma conta?
            </span>{" "}
            <Link
              href='/login'
              className='text-blue-600 hover:underline dark:text-blue-400'
            >
              Logar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
