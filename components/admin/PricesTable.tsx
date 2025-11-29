"use client";

import { useEffect, useState } from "react";
import {
    createPrice,
    getPrices,
    updatePrice,
} from "@/app/admin/actions/prices";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PricesTableProps {
    variantId: number;
}

const GROUPS = [
    { label: "Grupa 1", key: "grupa_1" },
    { label: "Grupa 2", key: "grupa_2" },
    { label: "Grupa 3", key: "grupa_3" },
    { label: "Grupa 4", key: "grupa_4" },
];

export default function PricesTable({ variantId }: PricesTableProps) {
    const [prices, setPrices] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    async function refresh() {
        setLoading(true);

        const rows = await getPrices(variantId);
        const map: Record<string, any> = {};

        rows.forEach((p) => {
            map[p.price_type] = p; // KLUCZ ZE ZGODNYM price_type
        });

        setPrices(map);
        setLoading(false);
    }

    useEffect(() => {
        setPrices({});
        refresh(); // wczytaj dane za każdym razem gdy zmienia się wariant
    }, [variantId]);

    async function handleChange(priceType: string, rawValue: string) {
        const num = Number(rawValue);
        if (isNaN(num)) return;

        const existing = prices[priceType];

        // Optimistyczny update – ale po zapisie i tak będzie refresh
        setPrices((prev) => ({
            ...prev,
            [priceType]: { ...(prev[priceType] || {}), price: num },
        }));

        if (existing?.id) {
            const fd = new FormData();
            fd.append("id", existing.id);
            fd.append("price", num.toString());
            fd.append("currency", "PLN");
            fd.append("price_type", priceType);

            await updatePrice(fd);
        } else {
            const fd = new FormData();
            fd.append("variant_id", String(variantId));
            fd.append("price", String(num));
            fd.append("currency", "PLN");
            fd.append("price_type", priceType);

            await createPrice(fd);
        }

        // Po zapisie zawsze pobierz świeże dane z bazy
        await refresh();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
            {GROUPS.map(({ label, key }) => (
                <Card
                    key={key}
                    className="p-4 rounded-xl bg-white shadow-sm border"
                >
                    <Label className="block mb-2 font-medium">{label}</Label>

                    <Input
                        type="number"
                        value={prices[key]?.price ?? ""} // zawsze controlled
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder="Cena..."
                        className="text-sm"
                    />

                    {loading && !prices[key] && (
                        <div className="flex items-center gap-2 text-xs mt-2 text-gray-400">
                            <Loader2 className="animate-spin w-3 h-3" />
                            Ładowanie...
                        </div>
                    )}
                </Card>
            ))}
        </motion.div>
    );
}
