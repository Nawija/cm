// app/admin/actions/prices.ts
"use server";

import { db } from "@/lib/db";
import type { Price } from "@/types/catalog";

export async function getPrices(variant_id?: number): Promise<Price[]> {
    const rows = variant_id
        ? await db`SELECT * FROM prices WHERE variant_id = ${variant_id} ORDER BY created_at DESC`
        : await db`SELECT * FROM prices ORDER BY created_at DESC`;
    return rows as Price[];
}

export async function createPrice(formData: FormData): Promise<Price> {
    const variant_id = Number(formData.get("variant_id"));
    const price = Number(formData.get("price"));
    const currency = String(formData.get("currency") ?? "PLN");
    const valid_from = formData.get("valid_from")
        ? String(formData.get("valid_from"))
        : null;
    const valid_to = formData.get("valid_to")
        ? String(formData.get("valid_to"))
        : null;
    const price_type = String(formData.get("price_type") ?? "standard");

    if (!variant_id || !price) throw new Error("Brak wariantu lub ceny");

    const inserted = await db`
    INSERT INTO prices (variant_id, price, currency, valid_from, valid_to, price_type)
    VALUES (${variant_id}, ${price}, ${currency}, ${valid_from}, ${valid_to}, ${price_type})
    RETURNING *`;

    return inserted[0] as Price;
}

export async function updatePrice(formData: FormData): Promise<Price> {
    const id = Number(formData.get("id"));
    const price = formData.get("price") ? Number(formData.get("price")) : null;
    const currency = formData.get("currency")
        ? String(formData.get("currency"))
        : null;
    const valid_from = formData.get("valid_from")
        ? String(formData.get("valid_from"))
        : null;
    const valid_to = formData.get("valid_to")
        ? String(formData.get("valid_to"))
        : null;
    const price_type = formData.get("price_type")
        ? String(formData.get("price_type"))
        : null;

    if (!id || !price) throw new Error("Brak id lub ceny");

    const updated = await db`
    UPDATE prices
    SET price = ${price}, currency = ${currency}, valid_from = ${valid_from},
        valid_to = ${valid_to}, price_type = ${price_type}
    WHERE id = ${id}
    RETURNING *`;

    return updated[0] as Price;
}

export async function getPricesForModule(module_id: number): Promise<Price[]> {
    if (!module_id) return [];

    const rows = await db`
        SELECT *
        FROM prices
        WHERE module_id = ${module_id}
        ORDER BY variant_id ASC
    `;

    return rows as Price[];
}

/**
 * Upsert ceny: jeśli istnieje rekord dla (variant_id + module_id),
 * to go aktualizuje, jeśli nie — tworzy nowy.
 */
export async function savePrice(formData: FormData): Promise<Price> {
    const variant_id = Number(formData.get("variant_id"));
    const module_id = Number(formData.get("module_id"));
    const price = Number(formData.get("price"));
    const currency = String(formData.get("currency") ?? "PLN");
    const price_type = String(formData.get("price_type") ?? "default");
    const valid_from = formData.get("valid_from")
        ? String(formData.get("valid_from"))
        : null;
    const valid_to = formData.get("valid_to")
        ? String(formData.get("valid_to"))
        : null;

    if (!variant_id) throw new Error("Brak variant_id");
    if (!module_id) throw new Error("Brak module_id");
    if (isNaN(price)) throw new Error("Niepoprawna cena");

    // Sprawdzenie czy istnieje już cena dla tego modułu i wariantu
    const existing = await db`
        SELECT *
        FROM prices
        WHERE variant_id = ${variant_id}
          AND module_id = ${module_id}
        LIMIT 1
    `;

    // Jeśli cena istnieje — aktualizujemy
    if (existing.length > 0) {
        const updated = await db`
            UPDATE prices
            SET price = ${price},
                currency = ${currency},
                price_type = ${price_type},
                valid_from = ${valid_from},
                valid_to = ${valid_to}
            WHERE id = ${existing[0].id}
            RETURNING *
        `;
        return updated[0] as Price;
    }

    // W przeciwnym wypadku — tworzymy cenę
    const inserted = await db`
        INSERT INTO prices (
            module_id,
            variant_id,
            price,
            currency,
            price_type,
            valid_from,
            valid_to
        )
        VALUES (
            ${module_id},
            ${variant_id},
            ${price},
            ${currency},
            ${price_type},
            ${valid_from},
            ${valid_to}
        )
        RETURNING *
    `;

    return inserted[0] as Price;
}

/**
 * Usuwanie ceny po id.
 */
export async function deletePrice(
    formData: FormData
): Promise<{ success: true }> {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id ceny");

    await db`DELETE FROM prices WHERE id = ${id}`;
    return { success: true };
}
