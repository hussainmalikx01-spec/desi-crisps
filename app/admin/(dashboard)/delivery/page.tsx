import { prisma } from "@/lib/prisma";
import DeliveryCitiesForm from "@/components/admin/DeliveryCitiesForm";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  const cities = await prisma.deliveryCity.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-cream">Delivery Cities</h1>
      <p className="mt-1 text-sm text-cream-dim">
        Control which cities customers can order to, and set a custom delivery fee per city. Cities
        without a custom fee use the standard shipping fee from Site Settings.
      </p>
      <div className="mt-6">
        <DeliveryCitiesForm initialCities={cities.map((c) => ({ ...c, deliveryFee: c.deliveryFee }))} />
      </div>
    </div>
  );
}
