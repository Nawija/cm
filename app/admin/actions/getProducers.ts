"use server";

// app/admin/actions/getProducers.ts
import { db } from "@/lib/db";
import type { Producer } from "@/types/catalog";

export async function getProducers(): Promise<Producer[]> {
    const rows =
        await db`SELECT id, name, slug, description, meta, created_at, updated_at FROM producers ORDER BY name`;
    return rows as Producer[];
}
