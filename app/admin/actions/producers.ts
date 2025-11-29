// app/admin/actions/producers.ts
"use server";

import { db } from "@/lib/db";
import slugify from "slugify";
import type { Producer } from "@/types/catalog";

export async function getProducers(): Promise<Producer[]> {
    const rows =
        await db`SELECT id, name, slug, description, meta, created_at, updated_at FROM producers ORDER BY name`;
    return rows as Producer[];
}

export async function createProducer(formData: FormData): Promise<Producer> {
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name) throw new Error("Nazwa producenta jest wymagana");

    const slug = slugify(name, { lower: true, strict: true });

    const inserted = await db`
    INSERT INTO producers (name, slug, description)
    VALUES (${name}, ${slug}, ${description})
    RETURNING id, name, slug, description, meta, created_at, updated_at
  `;

    return inserted[0] as Producer;
}

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

export async function deleteProducer(
    formData: FormData
): Promise<{ success: boolean }> {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id");

    await db`DELETE FROM producers WHERE id = ${id}`;
    return { success: true };
}
