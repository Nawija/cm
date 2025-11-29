"use client";

import { useState, useEffect } from "react";
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
} from "@/app/admin/actions/collections";
import { MainButton } from "@/components/ui/main-button";

interface Props {
    producerId: number;
    selectedCollection: number | null;
    setSelectedCollection: (id: number) => void;
}

export default function CollectionsTable({
    producerId,
    selectedCollection,
    setSelectedCollection,
}: Props) {
    const [collections, setCollections] = useState<any[]>([]);
    const [name, setName] = useState("");

    const loadCollections = async () => {
        const rows = await getCollections(producerId);
        setCollections(rows);
    };

    useEffect(() => {
        if (producerId) loadCollections();
    }, [producerId]);

    const handleAdd = async () => {
        const fd = new FormData();
        fd.set("producer_id", String(producerId));
        fd.set("name", name);
        const newCollection = await createCollection(fd);
        setName("");
        setSelectedCollection(newCollection.id);
        loadCollections();
    };

    return (
        <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold">Kolekcje</h3>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nowa kolekcja"
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
                    {collections.map((c) => (
                        <tr
                            key={c.id}
                            className={`cursor-pointer ${
                                selectedCollection === c.id ? "bg-gray-200" : ""
                            }`}
                            onClick={() => setSelectedCollection(c.id)}
                        >
                            <td className="p-2 border">{c.id}</td>
                            <td className="p-2 border">{c.name}</td>
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
