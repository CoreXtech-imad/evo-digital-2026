"use client";

import { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle, Loader2, Link2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: string;
  url: string;
  type: string;
}

export default function AdminUploadPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [productId, setProductId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async (file: File) => {
    if (!productId.trim()) {
      toast.error("Veuillez entrer l'ID du produit");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId);

      const adminKey = sessionStorage.getItem("evo_admin_key") || "";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminKey}` },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur upload");
      }

      const data = await res.json();
      setUploadedFiles((prev) => [
        {
          name: file.name,
          size: formatSize(data.size || file.size),
          url: data.fileUrl,
          type: file.name.split(".").pop()?.toUpperCase() || "FILE",
        },
        ...prev,
      ]);

      toast.success("Fichier uploadé avec succès!");
    } catch (err: any) {
      clearInterval(progressInterval);
      toast.error(err.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [productId]
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black font-headline">Upload Fichiers</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Uploadez les fichiers numériques de vos produits vers Firebase Storage
        </p>
      </div>

      {/* Product ID */}
      <div className="glass-card rounded-2xl p-5 border border-white/5">
        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
          ID du Produit *
        </label>
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Copiez l'ID depuis la liste des produits..."
          className="input-field"
        />
        <p className="text-xs text-on-surface-variant mt-2">
          💡 Trouvez l&apos;ID dans Admin → Produits → Détails du produit
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
          dragging
            ? "border-primary bg-primary/5 shadow-neon-primary"
            : "border-white/10 hover:border-white/20 hover:bg-surface-container/50"
        )}
      >
        {uploading ? (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />
            <div>
              <p className="font-bold font-headline mb-2">Upload en cours...</p>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div
                  className="h-full hero-gradient rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{progress}%</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className={cn("w-12 h-12 mx-auto mb-4 transition-colors", dragging ? "text-primary" : "text-on-surface-variant/40")} />
            <p className="font-bold font-headline mb-1">
              {dragging ? "Déposez le fichier ici" : "Glissez-déposez votre fichier"}
            </p>
            <p className="text-sm text-on-surface-variant mb-4">
              ou
            </p>
            <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
              <File className="w-4 h-4" />
              Parcourir les fichiers
              <input
                type="file"
                className="hidden"
                onChange={onFileInput}
                accept=".zip,.pdf,.exe,.mp4,.rar,.7z,.fig,.sketch,.xd,.py,.js,.ts"
              />
            </label>
            <p className="text-xs text-on-surface-variant mt-4">
              Formats: ZIP, PDF, EXE, MP4, RAR, 7Z, FIG, PY, JS — Max 500MB
            </p>
          </>
        )}
      </div>

      {/* Allowed formats info */}
      <div className="glass-card rounded-2xl p-5 border border-white/5">
        <h3 className="font-bold font-headline text-sm mb-3">Formats acceptés</h3>
        <div className="flex flex-wrap gap-2">
          {["ZIP", "PDF", "EXE", "MP4", "RAR", "7Z", "FIG", "SKETCH", "PY", "JS", "TS", "MOV"].map((fmt) => (
            <span key={fmt} className="px-2.5 py-1 rounded-lg bg-surface-container-high text-xs font-mono text-on-surface-variant border border-white/5">
              .{fmt.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Uploaded files history */}
      {uploadedFiles.length > 0 && (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-surface-container/30">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <h2 className="font-bold font-headline text-sm">Fichiers uploadés</h2>
          </div>
          <div className="divide-y divide-white/5">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-primary">{file.type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-on-surface-variant">{file.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-primary bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20"
                  >
                    <Copy className="w-3 h-3" />
                    Copier URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-start gap-2">
          <Link2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-on-surface-variant">
            <p className="font-bold text-primary mb-1">🔐 Fichiers 100% sécurisés</p>
            <p>Les fichiers sont stockés dans Firebase Storage avec accès privé. Les clients reçoivent des liens signés temporaires valides 72h avec max 3 téléchargements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
