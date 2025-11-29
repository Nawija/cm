// app/admin/actions/createProducer.ts
"use server";

import { db } from "@/lib/db";
import slugify from "slugify";
import type { Producer } from "@/types/catalog";

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
