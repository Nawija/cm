"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { getModules, createModule } from "@/app/admin/actions/modules";
import { getVariants, createVariant } from "@/app/admin/actions/variants";
import { getPricesForModule, savePrice, updatePrice } from "@/app/admin/actions/prices";

import { MainButton } from "@/components/ui/main-button";

interface Props {
    collectionId: number;
}

export default function ModuleEditor({ collectionId }: Props) {
    const [modules, setModules] = useState<any[]>([]);
    const [variants, setVariants] = useState<any[]>([]);
    const [prices, setPrices] = useState<Record<number, any>>({});
    const [selectedModule, setSelectedModule] = useState<number | null>(null);

    const [newModule, setNewModule] = useState("");
    const [newVariant, setNewVariant] = useState("");

    async function loadModules() {
        const rows = await getModules(collectionId);
        setModules(rows);
    }

    async function loadVariants() {
        const rows = await getVariants(collectionId);
        setVariants(rows);
    }

    async function loadPrices(moduleId: number) {
        const rows = await getPricesForModule(moduleId);
        const map: Record<number, any> = {};
        rows.forEach((p) => {
            map[p.variant_id] = p;
        });
        setPrices(map);
    }

    useEffect(() => {
        loadModules();
        loadVariants();
    }, [collectionId]);

    // Wczytaj ceny po zmianie modułu
    useEffect(() => {
        if (selectedModule) {
            loadPrices(selectedModule);
        } else {
            setPrices({});
        }
    }, [selectedModule]);

    async function handlePriceChange(variantId: number, value: string) {
        const num = Number(value);
        if (isNaN(num)) return;

        if (!selectedModule) return;

        const fd = new FormData();
        fd.append("variant_id", String(variantId));
        fd.append("module_id", String(selectedModule));
        fd.append("price", String(num));
        fd.append("currency", "PLN");
        fd.append("price_type", "default");

        const saved = await savePrice(fd);

        setPrices((prev) => ({
            ...prev,
            [variantId]: saved,
        }));
    }

    return (
        <div className="flex gap-6">
            {/* LISTA MODUŁÓW */}
            <div className="w-1/4 space-y-4">
                <h2 className="text-lg font-semibold">Moduły</h2>

                <div className="space-y-2">
                    {modules.map((m) => (
                        <motion.div
                            key={m.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedModule(m.id)}
                            className={`cursor-pointer p-3 rounded-xl border transition ${
                                selectedModule === m.id
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-100"
                            }`}
                        >
                            {m.name}
                        </motion.div>
                    ))}
                </div>

                <div className="flex gap-2 mt-4">
                    <input
                        value={newModule}
                        onChange={(e) => setNewModule(e.target.value)}
                        placeholder="Nowy moduł…"
                        className="flex-1 border rounded-xl px-3 py-2"
                    />
                    <MainButton onClick={loadModules}>
                        <Plus className="w-4 h-4" />
                    </MainButton>
                </div>
            </div>

            {/* WARIANTY + CENY */}
            <div className="flex-1 space-y-4">
                <h2 className="text-lg font-semibold">Warianty i ceny</h2>

                {!selectedModule ? (
                    <div className="opacity-60">
                        Wybierz moduł po lewej, aby edytować ceny.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {variants.map((v) => {
                            const current = prices[v.id]?.price ?? "";

                            return (
                                <div
                                    key={v.id}
                                    className="p-4 bg-gray-100 rounded-xl border flex items-center justify-between"
                                >
                                    <div className="font-medium">{v.name}</div>

                                    <input
                                        type="number"
                                        value={current}
                                        onChange={(e) =>
                                            setPrices((prev) => ({
                                                ...prev,
                                                [v.id]: {
                                                    ...(prev[v.id] || {}),
                                                    price: e.target.value,
                                                },
                                            }))
                                        }
                                        onBlur={async (e) => {
                                            await updatePrice(
                                                v.id,
                                                e.target.value
                                            );
                                            if (selectedModule)
                                                loadPrices(selectedModule); // refresh po zapisie
                                        }}
                                        placeholder="Cena"
                                        className="w-32 px-3 py-2 rounded-lg border"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex gap-2 pt-3">
                    <input
                        value={newVariant}
                        onChange={(e) => setNewVariant(e.target.value)}
                        placeholder="Nowy wariant (np. Grupa 1)"
                        className="flex-1 border rounded-xl px-3 py-2"
                    />
                    <MainButton onClick={loadVariants}>
                        <Plus className="w-4 h-4" />
                    </MainButton>
                </div>
            </div>
        </div>
    );
}
