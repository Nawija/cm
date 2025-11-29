// app/admin/actions/collections.ts
"use server";

import { db } from "@/lib/db";
import type { Collection } from "@/types/catalog";

export async function getCollections(
    producer_id?: number
): Promise<Collection[]> {
    const rows = producer_id
        ? await db`SELECT * FROM collections WHERE producer_id = ${producer_id} ORDER BY name`
        : await db`SELECT * FROM collections ORDER BY name`;
    return rows as Collection[];
}

export async function createCollection(
    formData: FormData
): Promise<Collection> {
    const producer_id = Number(formData.get("producer_id"));
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!producer_id || !name)
        throw new Error("Brak producenta lub nazwy kolekcji");

    const inserted = await db`
    INSERT INTO collections (producer_id, name, description)
    VALUES (${producer_id}, ${name}, ${description})
    RETURNING *`;
    return inserted[0] as Collection;
}

export async function updateCollection(
    formData: FormData
): Promise<Collection> {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!id || !name) throw new Error("Brak id lub nazwy");

    const updated = await db`
    UPDATE collections
    SET name = ${name}, description = ${description}
    WHERE id = ${id}
    RETURNING *`;
    return updated[0] as Collection;
}

export async function deleteCollection(
    formData: FormData
): Promise<{ success: boolean }> {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id");

    await db`DELETE FROM collections WHERE id = ${id}`;
    return { success: true };
}
