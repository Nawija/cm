"use client";

import { Producer } from "@/types/catalog";
import { useState } from "react";
import { createProducer, updateProducer, deleteProducer } from "@/app/admin/actions/producers";
import { MainButton } from "@/components/ui/main-button";

interface Props {
  producers: Producer[];
  selectedProducer: number | null;
  setSelectedProducer: (id: number) => void;
}

export default function ProducersTable({ producers, selectedProducer, setSelectedProducer }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const handleAdd = async () => {
    const fd = new FormData();
    fd.set("name", name);
    const newProducer = await createProducer(fd);
    setName("");
    setSelectedProducer(newProducer.id);
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">Producenci</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nowy producent"
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
          {producers.map((p) => (
            <tr
              key={p.id}
              className={`cursor-pointer ${selectedProducer === p.id ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedProducer(p.id)}
            >
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">
                {/* Tutaj można dodać przyciski edycji i usuwania */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
