"use client";

import { useState } from "react";
import { Star, ThumbsUp, User, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

const demoReviews: Review[] = [
  {
    id: "r1",
    customerName: "Karim B.",
    rating: 5,
    comment:
      "Produit de très haute qualité! Exactement ce dont j'avais besoin pour mon projet. La documentation est claire et le support est réactif.",
    verified: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "r2",
    customerName: "Sara L.",
    rating: 5,
    comment:
      "Excellent rapport qualité-prix. Je recommande fortement à tous les développeurs algériens. Paiement COD très pratique.",
    verified: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "r3",
    customerName: "Anis T.",
    rating: 4,
    comment:
      "Très bon produit dans l'ensemble. Quelques petits détails à améliorer mais rien de bloquant. J'en suis satisfait.",
    verified: false,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export default function ProductReviews({
  productId,
  rating,
  reviewCount,
}: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(demoReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) *
          100
        : 0,
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerName || !newReview.comment) {
      toast.error("Remplissez tous les champs");
      return;
    }
    if (newReview.comment.length < 10) {
      toast.error("Commentaire trop court (min 10 caractères)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newReview, productId }),
      });
      if (!res.ok) throw new Error();
      toast.success("Avis soumis avec succès! Il sera visible après modération.");
      setShowForm(false);
      setNewReview({ customerName: "", rating: 5, comment: "" });
    } catch {
      toast.error("Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rating overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average score */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-6xl font-black font-headline gradient-text">
              {rating.toFixed(1)}
            </div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "w-4 h-4",
                    s <= Math.round(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-white/20"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              {reviewCount} avis
            </p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {ratingDistribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant w-3">
                  {star}
                </span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface-variant w-4 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write review CTA */}
        <div className="flex items-center justify-center md:justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Laisser un avis
          </button>
        </div>
      </div>

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="glass-card rounded-2xl p-6 border border-primary/10 space-y-4"
        >
          <h3 className="font-bold font-headline">Votre avis</h3>

          {/* Star rating */}
          <div>
            <label className="block text-sm text-on-surface-variant mb-2">
              Note
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: s })}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    className={cn(
                      "w-7 h-7 transition-colors",
                      s <= newReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/20 hover:text-yellow-400/50"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-on-surface-variant mb-1.5">
                Nom *
              </label>
              <input
                value={newReview.customerName}
                onChange={(e) =>
                  setNewReview({ ...newReview, customerName: e.target.value })
                }
                placeholder="Votre nom"
                className="input-field"
                maxLength={60}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">
              Commentaire * (min 10 caractères)
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Partagez votre expérience avec ce produit..."
              rows={4}
              className="input-field resize-none"
              maxLength={500}
            />
            <p className="text-xs text-on-surface-variant mt-1 text-right">
              {newReview.comment.length}/500
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              Soumettre
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="glass-card rounded-2xl p-5 border border-white/5"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full hero-gradient flex items-center justify-center text-xs font-bold text-on-primary flex-shrink-0">
                {review.customerName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm font-headline">
                    {review.customerName}
                  </span>
                  {review.verified && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-400/10 text-green-400 border border-green-400/20 font-medium">
                      ✓ Achat vérifié
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-3 h-3",
                          s <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/20"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {new Date(review.createdAt).toLocaleDateString("fr-DZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
