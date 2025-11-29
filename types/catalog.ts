export interface Producer {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    meta?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Collection {
    id: number;
    producer_id: number;
    name: string;
    description?: string;
    created_at: string;
}

export interface Module {
    id: number;
    collection_id: number;
    name: string;
    code?: string;
    category?: string;
    width?: number;
    height?: number;
    depth?: number;
    extra_attributes: Record<string, any>;
    created_at: string;
}

export interface ModuleVariant {
    id: number;
    module_id: number;
    name: string;
    attributes: Record<string, any>;
    created_at: string;
}

export interface Price {
    id: number;
    variant_id: number;
    price: number;
    currency: string;
    valid_from?: string;
    valid_to?: string;
    price_type: string;
    created_at: string;
}
