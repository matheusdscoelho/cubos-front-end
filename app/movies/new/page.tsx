"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateMovie } from "@/lib/queries";
import Image from "next/image";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  releaseDate: z.string().min(1, "Data é obrigatória"),
  duration: z.number().min(1, "Duração em minutos"),
  budget: z.number().min(0, "Orçamento deve ser positivo"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewMoviePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const createMovie = useCreateMovie();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError("");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("releaseDate", data.releaseDate);
      formData.append("duration", String(data.duration));
      formData.append("budget", String(data.budget));

      const imageFile = (data.image as FileList)?.[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createMovie.mutateAsync(formData);
      router.push("/movies");
    } catch (err) {
      type ErrorResponse = { response?: { data?: { error?: string } } };
      const errorMsg =
        (err as ErrorResponse)?.response?.data?.error || "Erro ao fazer login";
      setServerError(errorMsg);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800 dark:text-white'>
        Novo Filme
      </h1>

      {serverError && <p className='text-red-500 mb-4'>{serverError}</p>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
        encType='multipart/form-data'
      >
        <div>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            Título
          </label>
          <input
            {...register("title")}
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          />
          {errors.title && (
            <p className='text-red-500 text-sm'>{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            Descrição
          </label>
          <textarea
            {...register("description")}
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            Data de Lançamento
          </label>
          <input
            type='date'
            {...register("releaseDate")}
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          />
          {errors.releaseDate && (
            <p className='text-red-500 text-sm'>{errors.releaseDate.message}</p>
          )}
        </div>

        <div>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            Duração (min)
          </label>
          <input
            type='number'
            {...register("duration", { valueAsNumber: true })}
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          />
          {errors.duration && (
            <p className='text-red-500 text-sm'>{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label className='block mb-1 text-sm text-gray-700 dark:text-gray-300'>
            Orçamento (R$)
          </label>
          <input
            type='number'
            {...register("budget", { valueAsNumber: true })}
            className='w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          />
          {errors.budget && (
            <p className='text-red-500 text-sm'>{errors.budget.message}</p>
          )}
        </div>

        <div className='flex flex-col items-center'>
          <span className='text-sm mb-2 font-medium'>Nova imagem:</span>

          <div className='relative inline-block'>
            <input
              type='file'
              {...register("image")}
              accept='image/*'
              onChange={onImageChange}
              className='w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer transition'
            />
          </div>

          <p className='text-xs text-gray-500 mt-1'>
            Formatos permitidos: JPG, PNG. Tamanho máx: 5MB.
          </p>

          {previewImage && (
            <Image
              width={240}
              height={240}
              src={previewImage}
              alt='Preview'
              className='rounded-xl border object-cover shadow-md mt-4'
            />
          )}
        </div>

        <button
          type='submit'
          disabled={createMovie.isPending}
          className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50'
        >
          {createMovie.isPending ? "Salvando..." : "Salvar Filme"}
        </button>
      </form>
    </div>
  );
}
