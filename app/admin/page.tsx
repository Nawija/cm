// app/admin/page.tsx

import AdminPanel from "@/components/admin/AdminPanel";
import { getProducers } from "./actions/producers";
import ProducersClient from "@/components/admin/ProducersClient";

export default async function AdminPage() {
    const producers = await getProducers();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Panel admina — producenci
            </h1>
            {/* Przekazujemy dane do komponentu klienckiego */}
            <AdminPanel  />
        </div>
    );
}
