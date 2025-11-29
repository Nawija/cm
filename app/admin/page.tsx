// app/admin/page.tsx

import { getProducers } from "./actions/getProducers";
import ProducersClient from "@/components/admin/ProducersClient";

export default async function AdminPage() {
    const producers = await getProducers();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Panel admina — producenci
            </h1>
            {/* Przekazujemy dane do komponentu klienckiego */}
            <ProducersClient initialProducers={producers} />
        </div>
    );
}
