"use client";

import { useState } from "react";
import type { Producer } from "@/types/catalog";
import ProducerRow from "@/components/admin/ProducerRow";
import ProducerForm from "@/components/admin/ProducerForm";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Props {
    initialProducers: Producer[];
}

export default function ProducersClient({ initialProducers }: Props) {
    const [producers, setProducers] = useState<Producer[]>(initialProducers);
    const [editing, setEditing] = useState<Producer | null>(null);
    const [creating, setCreating] = useState(false);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-medium">Lista producentów</h2>
                <Button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={16} /> Dodaj
                </Button>
            </div>

            <div className="space-y-2">
                {producers.map((p) => (
                    <ProducerRow
                        key={p.id}
                        producer={p}
                        onEdit={() => setEditing(p)}
                        onDelete={(id) =>
                            setProducers((prev) =>
                                prev.filter((x) => x.id !== id)
                            )
                        }
                    />
                ))}

                {producers.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                        Brak producentów
                    </div>
                )}
            </div>

            {/* Modal / sliding panel for create / edit */}
            {creating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div
                        className="bg-black/40 absolute inset-0"
                        onClick={() => setCreating(false)}
                    />
                    <div className="relative bg-white rounded-lg p-6 w-[720px] z-10 shadow-lg">
                        <ProducerForm
                            onSuccess={(newProducer) => {
                                setProducers((prev) => [newProducer, ...prev]);
                                setCreating(false);
                            }}
                            onCancel={() => setCreating(false)}
                        />
                    </div>
                </motion.div>
            )}

            {editing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div
                        className="bg-black/40 absolute inset-0"
                        onClick={() => setEditing(null)}
                    />
                    <div className="relative bg-white rounded-lg p-6 w-[720px] z-10 shadow-lg">
                        <ProducerForm
                            producer={editing}
                            onSuccess={(updated) => {
                                setProducers((prev) =>
                                    prev.map((p) =>
                                        p.id === updated.id ? updated : p
                                    )
                                );
                                setEditing(null);
                            }}
                            onCancel={() => setEditing(null)}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
