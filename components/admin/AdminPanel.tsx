"use client";

import { useState, useEffect } from "react";
import { getProducers } from "@/app/admin/actions/producers";
import ProducersTable from "./ProducersTable";
import CollectionsTable from "./CollectionsTable";
import ModulesTable from "./ModulesTable";
import VariantsTable from "./VariantsTable";
import PricesTable from "./PricesTable";

export default function AdminPanel() {
    const [producers, setProducers] = useState<any[]>([]);
    const [selectedProducer, setSelectedProducer] = useState<number | null>(
        null
    );
    const [selectedCollection, setSelectedCollection] = useState<number | null>(
        null
    );
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

    useEffect(() => {
        getProducers().then(setProducers);
    }, []);

    return (
        <div className="p-4 space-y-6">
            <ProducersTable
                producers={producers}
                selectedProducer={selectedProducer}
                setSelectedProducer={(id) => {
                    setSelectedProducer(id);
                    setSelectedCollection(null);
                    setSelectedModule(null);
                    setSelectedVariant(null);
                }}
            />

            {selectedProducer && (
                <CollectionsTable
                    producerId={selectedProducer}
                    selectedCollection={selectedCollection}
                    setSelectedCollection={(id) => {
                        setSelectedCollection(id);
                        setSelectedModule(null);
                        setSelectedVariant(null);
                    }}
                />
            )}

            {selectedCollection && (
                <ModulesTable
                    collectionId={selectedCollection}
                    selectedModule={selectedModule}
                    setSelectedModule={(id) => {
                        setSelectedModule(id);
                        setSelectedVariant(null);
                    }}
                />
            )}

            {selectedModule && (
                <VariantsTable
                    moduleId={selectedModule}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                />
            )}

            {selectedVariant && <PricesTable variantId={selectedVariant} />}
        </div>
    );
}
