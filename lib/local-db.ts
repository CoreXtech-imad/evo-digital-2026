/**
 * File-based local database — used as fallback when Firebase is not configured.
 * Data is stored in data/products.json and data/orders.json.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// On Vercel/serverless the project root is read-only — use /tmp instead
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "evo-data")
  : path.join(process.cwd(), "data");

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readCollection(name: string): Promise<any[]> {
  await ensureDir();
  try {
    const raw = await readFile(path.join(DATA_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeCollection(name: string, docs: any[]) {
  await ensureDir();
  await writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(docs, null, 2), "utf-8");
}

export const localDb = {
  collection(name: string) {
    return {
      async getAll(filters?: {
        category?: string | null;
        featured?: boolean;
        bestSeller?: boolean;
        limit?: number;
        orderByDesc?: string;
      }) {
        let docs = await readCollection(name);
        if (filters?.category) docs = docs.filter((d) => d.category === filters.category);
        if (filters?.featured) docs = docs.filter((d) => d.featured === true);
        if (filters?.bestSeller) docs = docs.filter((d) => d.bestSeller === true);
        if (filters?.orderByDesc) {
          const key = filters.orderByDesc;
          docs = docs.sort((a, b) => (a[key] < b[key] ? 1 : -1));
        }
        if (filters?.limit) docs = docs.slice(0, filters.limit);
        return docs;
      },

      async getById(id: string) {
        const docs = await readCollection(name);
        return docs.find((d) => d.id === id) ?? null;
      },

      async getBySlug(slug: string) {
        const docs = await readCollection(name);
        return docs.find((d) => d.slug === slug) ?? null;
      },

      async add(data: Record<string, any>) {
        const docs = await readCollection(name);
        const id = crypto.randomBytes(10).toString("hex");
        const doc = { id, ...data };
        docs.unshift(doc);
        await writeCollection(name, docs);
        return id;
      },

      async update(id: string, data: Record<string, any>) {
        const docs = await readCollection(name);
        const idx = docs.findIndex((d) => d.id === id);
        if (idx === -1) throw new Error("Document not found");
        docs[idx] = { ...docs[idx], ...data };
        await writeCollection(name, docs);
      },

      async remove(id: string) {
        const docs = await readCollection(name);
        const filtered = docs.filter((d) => d.id !== id);
        await writeCollection(name, filtered);
      },
    };
  },
};
