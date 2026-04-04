"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, File, X, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface FileUploadWidgetProps {
  productId?: string;
  onUploadComplete?: (url: string, filename: string, size: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

export default function FileUploadWidget({
  productId,
  onUploadComplete,
  accept = ".zip,.pdf,.exe,.mp4,.rar,.7z,.fig,.sketch,.py,.js,.ts",
  maxSizeMB = 500,
}: FileUploadWidgetProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const uploadFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Fichier trop volumineux (max ${maxSizeMB}MB)`);
      setState("error");
      return;
    }

    setState("uploading");
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (productId) formData.append("productId", productId);

      // Get admin key from session
      const adminKey = sessionStorage.getItem("evo_admin_key") ?? "";

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminKey}` },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload échoué");
      }

      const data = await res.json();
      setProgress(100);
      setState("success");
      setUploadedFile({
        name: file.name,
        size: formatSize(file.size),
        url: data.fileUrl,
      });

      onUploadComplete?.(data.fileUrl, file.name, formatSize(file.size));
      toast.success("Fichier uploadé avec succès!");
    } catch (err: any) {
      clearInterval(progressInterval);
      setErrorMsg(err.message);
      setState("error");
      toast.error(err.message);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setState("idle");
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setUploadedFile(null);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {state === "success" && uploadedFile ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-400 truncate">{uploadedFile.name}</p>
            <p className="text-xs text-on-surface-variant">{uploadedFile.size} · Uploadé avec succès</p>
          </div>
          <button onClick={reset} className="p-1 text-on-surface-variant hover:text-white rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : state === "uploading" ? (
        <div className="p-5 rounded-xl border border-white/10 bg-surface-container">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
            <span className="text-sm font-medium">Upload en cours...</span>
            <span className="ml-auto text-sm text-primary font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #61cdff, #aa8bff)" }}
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setState("dragging"); }}
          onDragLeave={() => setState("idle")}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300",
            state === "dragging"
              ? "border-primary bg-primary/5 scale-[1.01]"
              : state === "error"
              ? "border-error/40 bg-error/5"
              : "border-white/10 hover:border-primary/40 hover:bg-primary/5"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {state === "error" ? (
            <>
              <AlertCircle className="w-10 h-10 text-error mb-3" />
              <p className="text-sm font-medium text-error mb-1">{errorMsg}</p>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-xs text-on-surface-variant hover:text-white transition-colors mt-2"
              >
                Réessayer
              </button>
            </>
          ) : (
            <>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all", state === "dragging" ? "bg-primary/20 scale-110" : "bg-surface-container-high")}>
                <Upload className={cn("w-6 h-6 transition-colors", state === "dragging" ? "text-primary" : "text-on-surface-variant")} />
              </div>
              <p className="text-sm font-semibold mb-1">
                {state === "dragging" ? "Déposez le fichier ici" : "Glisser-déposer ou cliquer"}
              </p>
              <p className="text-xs text-on-surface-variant text-center">
                {accept.split(",").join(", ")} · Max {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
