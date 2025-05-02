"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import { useMovie, useEditMovie } from "@/lib/queries";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  releaseDate: z.string().min(1),
  duration: z.number().min(1),
  budget: z.number().min(0),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditMoviePage() {
  const router = useRouter();
  const { id } = useParams();
  const movieId = String(id);

  const { data: movie, isLoading: loadingMovie, isError } = useMovie(movieId);
  const editMutation = useEditMovie();
  const [serverError, setServerError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (movie) {
      setValue("title", movie.title);
      setValue("description", movie.description);
      setValue("releaseDate", movie.releaseDate.slice(0, 10));
      setValue("duration", movie.duration);
      setValue("budget", movie.budget);
    }
  }, [movie, setValue]);

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
      formData.append("duration", data.duration.toString());
      formData.append("budget", data.budget.toString());

      const imageFile = (data.image as FileList)?.[0];
      if (imageFile) formData.append("image", imageFile);

      await editMutation.mutateAsync({ id: movieId, data: formData });
      toast.success("Filme editado com sucesso!");
      router.push(`/movies/${movieId}`);
    } catch (err) {
      type ErrorResponse = { response?: { data?: { error?: string } } };
      const errorMsg =
        (err as ErrorResponse)?.response?.data?.error || "Erro ao edtiar filme";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (loadingMovie)
    return <p className='text-center py-10'>Carregando filme...</p>;
  if (isError || !movie)
    return <p className='text-center py-10'>Filme não encontrado.</p>;

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <BackButton label='Cancelar' />
      <h1 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white'>
        Editar Filme
      </h1>

      {serverError && <p className='text-red-500 mb-4'>{serverError}</p>}

      <div className='flex flex-col md:flex-row justify-center gap-6 mb-8'>
        <div className='flex flex-col items-center'>
          <span className='text-sm mb-2 font-medium'>Imagem atual:</span>
          {movie.image ? (
            <Image
              width={240}
              height={240}
              src={movie.image}
              alt='Imagem atual'
              className='rounded-xl shadow-md object-cover'
            />
          ) : (
            <div className='w-[240px] h-[240px] bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-sm text-gray-500'>
              Sem imagem
            </div>
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
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-6'
      >
        <div>
          <label className='block text-sm mb-1 font-medium'>Título</label>
          <input
            {...register("title")}
            className='w-full p-3 border rounded-lg dark:bg-gray-700'
          />
          {errors.title && (
            <p className='text-red-500 text-sm'>{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className='block text-sm mb-1 font-medium'>Descrição</label>
          <textarea
            {...register("description")}
            className='w-full p-3 border rounded-lg dark:bg-gray-700'
            rows={4}
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm mb-1 font-medium'>
              Data de Lançamento
            </label>
            <input
              type='date'
              {...register("releaseDate")}
              className='w-full p-3 border rounded-lg dark:bg-gray-700'
            />
            {errors.releaseDate && (
              <p className='text-red-500 text-sm'>
                {errors.releaseDate.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm mb-1 font-medium'>
              Duração (min)
            </label>
            <input
              type='number'
              {...register("duration", { valueAsNumber: true })}
              className='w-full p-3 border rounded-lg dark:bg-gray-700'
            />
            {errors.duration && (
              <p className='text-red-500 text-sm'>{errors.duration.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className='block text-sm mb-1 font-medium'>
            Orçamento (R$)
          </label>
          <input
            type='number'
            {...register("budget", { valueAsNumber: true })}
            className='w-full p-3 border rounded-lg dark:bg-gray-700'
          />
          {errors.budget && (
            <p className='text-red-500 text-sm'>{errors.budget.message}</p>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition duration-200'
          disabled={editMutation.isPending}
        >
          {editMutation.isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
