"use client";

import type { Producer } from "@/types/catalog";
import { Trash2, Edit } from "lucide-react";
import { deleteProducer } from "@/app/admin/actions/deleteProducer";

interface Props {
    producer: Producer;
    onEdit: () => void;
    onDelete: (id: number) => void;
}

export default function ProducerRow({ producer, onEdit, onDelete }: Props) {
    async function handleDelete() {
        if (!confirm(`Usunąć producenta "${producer.name}"?`)) return;
        // Wywołanie server action przez formData
        const fd = new FormData();
        fd.set("id", String(producer.id));
        try {
            await deleteProducer(fd);
            onDelete(producer.id);
        } catch (err) {
            console.error(err);
            alert("Błąd przy usuwaniu");
        }
    }

    return (
        <div className="flex items-center justify-between p-3 border rounded">
            <div>
                <div className="font-medium">{producer.name}</div>
                <div className="text-sm text-muted-foreground">
                    {producer.slug}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onEdit}
                    className="p-2 rounded hover:bg-slate-100"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 rounded hover:bg-rose-50 text-rose-600"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
