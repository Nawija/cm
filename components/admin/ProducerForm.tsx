"use client";

import React, { useState } from "react";
import type { Producer } from "@/types/catalog";
import { createProducer, updateProducer } from "@/app/admin/actions/producers";
import { Button } from "@/components/ui/button";

interface Props {
    producer?: Producer | null;
    onSuccess: (p: Producer) => void;
    onCancel: () => void;
}

export default function ProducerForm({ producer, onSuccess, onCancel }: Props) {
    const [name, setName] = useState(producer?.name ?? "");
    const [description, setDescription] = useState(producer?.description ?? "");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            fd.set("name", name);
            fd.set("description", description);
            if (producer) fd.set("id", String(producer.id));

            const result = producer
                ? await updateProducer(fd)
                : await createProducer(fd);
            onSuccess(result);
        } catch (err) {
            console.error(err);
            alert("Błąd zapisu");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">
                {producer ? "Edytuj producenta" : "Dodaj producenta"}
            </h3>

            <div>
                <label className="block text-sm font-medium mb-1">Nazwa</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Opis</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Anuluj
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Zapis..." : "Zapisz"}
                </Button>
            </div>
        </form>
    );
}
