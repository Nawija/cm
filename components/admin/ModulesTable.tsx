"use client";

import { useState, useEffect } from "react";
import { getModules, createModule } from "@/app/admin/actions/modules";
import { MainButton } from "@/components/ui/main-button";

interface Props {
    collectionId: number;
    selectedModule: number | null;
    setSelectedModule: (id: number) => void;
}

export default function ModulesTable({
    collectionId,
    selectedModule,
    setSelectedModule,
}: Props) {
    const [modules, setModules] = useState<any[]>([]);
    const [name, setName] = useState("");

    const loadModules = async () => {
        const rows = await getModules(collectionId);
        setModules(rows);
    };

    useEffect(() => {
        if (collectionId) loadModules();
    }, [collectionId]);

    const handleAdd = async () => {
        const fd = new FormData();
        fd.set("collection_id", String(collectionId));
        fd.set("name", name);
        const newModule = await createModule(fd);
        setName("");
        setSelectedModule(newModule.id);
        loadModules();
    };

    return (
        <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold">Moduły</h3>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nowy moduł"
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
                    {modules.map((m) => (
                        <tr
                            key={m.id}
                            className={`cursor-pointer ${
                                selectedModule === m.id ? "bg-gray-200" : ""
                            }`}
                            onClick={() => setSelectedModule(m.id)}
                        >
                            <td className="p-2 border">{m.id}</td>
                            <td className="p-2 border">{m.name}</td>
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
