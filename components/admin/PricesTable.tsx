"use client";

import { useState, useEffect } from "react";
import { getPrices, createPrice } from "@/app/admin/actions/prices";
import { MainButton } from "@/components/ui/main-button";

interface Props {
    variantId: number;
}

export default function PricesTable({ variantId }: Props) {
    const [prices, setPrices] = useState<any[]>([]);
    const [price, setPrice] = useState<number>(0);

    const loadPrices = async () => {
        const rows = await getPrices(variantId);
        setPrices(rows);
    };

    useEffect(() => {
        if (variantId) loadPrices();
    }, [variantId]);

    const handleAdd = async () => {
        const fd = new FormData();
        fd.set("variant_id", String(variantId));
        fd.set("price", String(price));
        const newPrice = await createPrice(fd);
        setPrice(0);
        loadPrices();
    };

    return (
        <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold">Ceny</h3>

            <div className="flex gap-2">
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Cena"
                    className="border p-2 rounded flex-1"
                />
                <MainButton onClick={handleAdd}>Dodaj</MainButton>
            </div>

            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Cena</th>
                        <th className="p-2 border">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {prices.map((p) => (
                        <tr key={p.id}>
                            <td className="p-2 border">{p.id}</td>
                            <td className="p-2 border">{p.price}</td>
                            <td className="p-2 border">
                                {/* Edycja / Usuwanie */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
