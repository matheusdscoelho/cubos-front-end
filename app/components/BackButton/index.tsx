"use client";

import { LucideArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ label = "Voltar" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className='inline-flex items-center gap-2 px-4 py-2 mb-10 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm rounded'
    >
      <LucideArrowLeft/>{label}
    </button>
  );
}
