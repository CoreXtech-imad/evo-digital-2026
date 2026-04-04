"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-on-surface font-body min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>

          <h1 className="text-2xl font-black font-headline mb-3">
            Une erreur s&apos;est produite
          </h1>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            Quelque chose s&apos;est mal passé. Veuillez réessayer ou retourner à
            l&apos;accueil.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="mb-6 text-left p-4 rounded-xl bg-error/5 border border-error/10">
              <summary className="text-xs text-error cursor-pointer font-mono mb-2">
                Détails de l&apos;erreur
              </summary>
              <pre className="text-xs text-on-surface-variant overflow-auto whitespace-pre-wrap">
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
            <Link
              href="/"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
