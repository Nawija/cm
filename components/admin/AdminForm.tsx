// components/admin/AdminForm.tsx

"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// -------------------------------------------------
// CollectionForm
// -------------------------------------------------
export function CollectionForm({
    initialData,
    onSubmit,
}: {
    initialData?: any;
    onSubmit: (data: any) => void;
}) {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4">
                <CardContent className="space-y-3">
                    <Input
                        placeholder="Nazwa kolekcji"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Opis"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button onClick={() => onSubmit({ name, description })}>
                        Zapisz
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// -------------------------------------------------
// ModuleForm
// -------------------------------------------------
export function ModuleForm({
    initialData,
    onSubmit,
}: {
    initialData?: any;
    onSubmit: (data: any) => void;
}) {
    const [name, setName] = useState(initialData?.name || "");
    const [code, setCode] = useState(initialData?.code || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [width, setWidth] = useState(initialData?.width || "");
    const [height, setHeight] = useState(initialData?.height || "");
    const [depth, setDepth] = useState(initialData?.depth || "");

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4">
                <CardContent className="space-y-3 grid grid-cols-2 gap-4">
                    <Input
                        placeholder="Nazwa modułu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Kod"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Input
                        placeholder="Kategoria"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <Input
                        placeholder="Szerokość"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                    />
                    <Input
                        placeholder="Wysokość"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                    <Input
                        placeholder="Głębokość"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                    />
                    <Button
                        onClick={() =>
                            onSubmit({
                                name,
                                code,
                                category,
                                width,
                                height,
                                depth,
                            })
                        }
                        className="col-span-2"
                    >
                        Zapisz
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// -------------------------------------------------
// VariantForm
// -------------------------------------------------
export function VariantForm({
    initialData,
    onSubmit,
}: {
    initialData?: any;
    onSubmit: (data: any) => void;
}) {
    const [name, setName] = useState(initialData?.name || "");
    const [attributes, setAttributes] = useState(initialData?.attributes || {});

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4">
                <CardContent className="space-y-3">
                    <Input
                        placeholder="Nazwa wariantu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <textarea
                        className="w-full border rounded p-2"
                        placeholder="Atrybuty JSON"
                        value={JSON.stringify(attributes)}
                        onChange={(e) => {
                            try {
                                setAttributes(JSON.parse(e.target.value));
                            } catch {}
                        }}
                    />

                    <Button onClick={() => onSubmit({ name, attributes })}>
                        Zapisz
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// -------------------------------------------------
// PriceForm
// -------------------------------------------------
export function PriceForm({
    initialData,
    onSubmit,
}: {
    initialData?: any;
    onSubmit: (data: any) => void;
}) {
    const [price, setPrice] = useState(initialData?.price || "");
    const [currency, setCurrency] = useState(initialData?.currency || "PLN");
    const [validFrom, setValidFrom] = useState(initialData?.valid_from || "");
    const [validTo, setValidTo] = useState(initialData?.valid_to || "");
    const [priceType, setPriceType] = useState(
        initialData?.price_type || "standard"
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4">
                <CardContent className="grid grid-cols-2 gap-4">
                    <Input
                        placeholder="Cena"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <Input
                        placeholder="Waluta"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                    <Input
                        placeholder="Ważne od"
                        type="date"
                        value={validFrom}
                        onChange={(e) => setValidFrom(e.target.value)}
                    />
                    <Input
                        placeholder="Ważne do"
                        type="date"
                        value={validTo}
                        onChange={(e) => setValidTo(e.target.value)}
                    />
                    <Input
                        placeholder="Typ ceny"
                        value={priceType}
                        onChange={(e) => setPriceType(e.target.value)}
                    />

                    <Button
                        onClick={() =>
                            onSubmit({
                                price,
                                currency,
                                valid_from: validFrom,
                                valid_to: validTo,
                                price_type: priceType,
                            })
                        }
                        className="col-span-2"
                    >
                        Zapisz
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
