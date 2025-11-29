"use client";

import { useState, useEffect } from "react";
import { getVariants, createVariant } from "@/app/admin/actions/variants";
import { MainButton } from "@/components/ui/main-button";

interface Props {
    moduleId: number;
    selectedVariant: number | null;
    setSelectedVariant: (id: number) => void;
}

export default function VariantsTable({
    moduleId,
    selectedVariant,
    setSelectedVariant,
}: Props) {
    const [variants, setVariants] = useState<any[]>([]);
    const [name, setName] = useState("");

    const loadVariants = async () => {
        const rows = await getVariants(moduleId);
        setVariants(rows);
    };

    useEffect(() => {
        if (moduleId) loadVariants();
    }, [moduleId]);

    const handleAdd = async () => {
        const fd = new FormData();
        fd.set("module_id", String(moduleId));
        fd.set("name", name);
        const newVariant = await createVariant(fd);
        setName("");
        setSelectedVariant(newVariant.id);
        loadVariants();
    };

    return (
        <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold">Warianty</h3>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nowy wariant"
                    className="border p-2 rounded flex-1"
                />
                <MainButton onClick={handleAdd}>Dodaj</MainButton>
            </div>

            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nazwa</th>
                        <th className="p-2 border">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {variants.map((v) => (
                        <tr
                            key={v.id}
                            className={`cursor-pointer ${
                                selectedVariant === v.id ? "bg-gray-200" : ""
                            }`}
                            onClick={() => setSelectedVariant(v.id)}
                        >
                            <td className="p-2 border">{v.id}</td>
                            <td className="p-2 border">{v.name}</td>
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
