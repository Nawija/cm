"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getVariants,
    createVariant,
    deleteVariant,
} from "@/app/admin/actions/variants";
import { MainButton } from "@/components/ui/main-button";
import { X, Plus } from "lucide-react";

interface Props {
    collectionId: number | null;
    selectedVariant: number | null;
    setSelectedVariant: (id: number | null) => void;
}

export default function VariantsTable({
    collectionId,
    selectedVariant,
    setSelectedVariant,
}: Props) {
    const [variants, setVariants] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        if (!collectionId) return;
        setVariants(await getVariants(collectionId));
    };

    useEffect(() => {
        load();
    }, [collectionId]);

    const handleAdd = async () => {
        if (!name.trim() || !collectionId) return;

        setLoading(true);
        const fd = new FormData();
        fd.set("collection_id", String(collectionId));
        fd.set("name", name);

        const newV = await createVariant(fd);
        setLoading(false);
        setName("");
        setSelectedVariant(newV.id);
        load();
    };

    const handleDelete = async (id: number) => {
        const fd = new FormData();
        fd.set("id", String(id));

        await deleteVariant(fd);

        // gdy kasujemy wybrany → resetuj
        if (selectedVariant === id) setSelectedVariant(null);
        load();
    };

    return (
        <div className="bg-white border rounded-2xl shadow p-6 space-y-6">
            <h3 className="text-xl font-semibold">
                Warianty (wspólne dla całej kolekcji)
            </h3>

            {/* ADD */}
            <div className="flex gap-3">
                <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="border rounded-xl px-4 py-2 flex-1 outline-none focus:ring-2 focus:ring-black/40 transition"
                    placeholder="Dodaj wariant… np. Grupa 1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <MainButton disabled={loading} onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-1" />
                    Dodaj
                </MainButton>
            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                    {variants.map((v) => {
                        const active = selectedVariant === v.id;

                        return (
                            <motion.div
                                key={v.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 180 }}
                                className={`relative p-5 rounded-2xl border cursor-pointer transition 
                                    shadow-sm hover:shadow-md 
                                    ${active ? "bg-black text-white border-black" : "bg-gray-100"}
                                `}
                                onClick={() => setSelectedVariant(v.id)}
                            >
                                <div className="font-medium text-lg">{v.name}</div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(v.id);
                                    }}
                                    className="absolute top-3 right-3 text-black/40 hover:text-black transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {active && (
                                    <motion.div
                                        layoutId="variantGlow"
                                        className="absolute inset-0 rounded-2xl ring-4 ring-black/40 pointer-events-none"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
