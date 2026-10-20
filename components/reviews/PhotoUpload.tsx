"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";

import { REVIEW_PHOTO_LIMITS } from "@/data/reviewsConfig";
import { cn } from "@/lib/utils";

export type UploadedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

type Props = {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
};

const { maxFiles, maxSizeMb, accept } = REVIEW_PHOTO_LIMITS;

/** "Прикрепить фото": bosib tanlash yoki sudrab tashlash, preview va o'chirish */
export default function PhotoUpload({ photos, onChange }: Props) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  // Komponent yopilganda preview URL'larni bo'shatish
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () =>
      photosRef.current.forEach((photo) =>
        URL.revokeObjectURL(photo.previewUrl),
      ),
    [],
  );

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList);
    const accepted: UploadedPhoto[] = [];
    let message = "";

    for (const file of files) {
      if (!(accept as readonly string[]).includes(file.type)) {
        message = "Можно загрузить только изображения JPG, PNG или WEBP.";
        continue;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        message = `Размер файла не должен превышать ${maxSizeMb} МБ.`;
        continue;
      }
      if (photos.length + accepted.length >= maxFiles) {
        message = `Можно прикрепить не более ${maxFiles} фото.`;
        break;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setError(message);
    if (accepted.length > 0) onChange([...photos, ...accepted]);
  };

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    onChange(photos.filter((p) => p.id !== id));
    setError("");
  };

  const isFull = photos.length >= maxFiles;

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isFull) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!isFull) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-[95px] flex-col items-center justify-center gap-2.5 rounded-[7px] border border-dashed px-5 py-5 text-center transition-colors",
          isFull
            ? "cursor-not-allowed border-[#E5E7EB] bg-[#F8F9FA]"
            : "cursor-pointer hover:border-[#186FD4] hover:bg-[#F8FBFF]",
          isDragging ? "border-[#186FD4] bg-[#F2F7FD]" : "border-[#E5E7EB]",
        )}
      >
        <ImageIcon className="size-5 text-[#91969D]" aria-hidden />
        <span className="text-[15px] leading-[22px] text-[#A0A5AC]">
          {isFull
            ? `Прикреплено максимальное количество фото (${maxFiles})`
            : "Нажмите для загрузки или перетащите файл в это поле"}
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept.join(",")}
          multiple
          disabled={isFull}
          aria-label="Прикрепить фото"
          className="sr-only"
          onChange={(e) => {
            addFiles(e.target.files);
            // Bir xil faylni qayta tanlash mumkin bo'lsin
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p role="alert" className="mt-1.5 text-[13px] text-[#E5484D]">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="relative size-[75px] overflow-hidden rounded-[6px] border border-[#E5E7EB]"
            >
              {/* blob: URL — next/image optimizatsiya qila olmaydi */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt={photo.file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label={`Удалить ${photo.file.name}`}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-[#011120]/70 text-white transition-colors hover:bg-[#011120]"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
