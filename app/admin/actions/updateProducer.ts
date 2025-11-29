// app/admin/actions/updateProducer.ts
"use server";

import { db } from "@/lib/db";
import slugify from "slugify";
import type { Producer } from "@/types/catalog";

export async function updateProducer(formData: FormData): Promise<Producer> {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!id || !name) throw new Error("Brak id lub nazwy");

    const slug = slugify(name, { lower: true, strict: true });

    const updated = await db`
    UPDATE producers
    SET name = ${name}, slug = ${slug}, description = ${description}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, name, slug, description, meta, created_at, updated_at
  `;

    return updated[0] as Producer;
}
