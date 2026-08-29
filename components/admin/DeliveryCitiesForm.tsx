"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

type City = { id: string; name: string; active: boolean; deliveryFee: number | null };

export default function DeliveryCitiesForm({ initialCities }: { initialCities: City[] }) {
  const router = useRouter();
  const [cities, setCities] = useState(initialCities);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/delivery-cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), active: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add city");
      setCities((c) => [...c, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      toast.success(`${data.name} added`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add city");
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(city: City) {
    setBusyId(city.id);
    try {
      const res = await fetch(`/api/delivery-cities/${city.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !city.active }),
      });
      if (!res.ok) throw new Error();
      setCities((cs) => cs.map((c) => (c.id === city.id ? { ...c, active: !c.active } : c)));
    } catch {
      toast.error("Failed to update city");
    } finally {
      setBusyId(null);
    }
  }

  async function updateFee(city: City, fee: string) {
    const value = fee === "" ? null : Number(fee);
    setCities((cs) => cs.map((c) => (c.id === city.id ? { ...c, deliveryFee: value } : c)));
  }

  async function saveFee(city: City) {
    setBusyId(city.id);
    try {
      const res = await fetch(`/api/delivery-cities/${city.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryFee: city.deliveryFee }),
      });
      if (!res.ok) throw new Error();
      toast.success("Fee updated");
    } catch {
      toast.error("Failed to update fee");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(city: City) {
    if (!confirm(`Remove ${city.name} from delivery cities?`)) return;
    setBusyId(city.id);
    try {
      const res = await fetch(`/api/delivery-cities/${city.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCities((cs) => cs.filter((c) => c.id !== city.id));
      toast.success("City removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove city");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a new city (e.g. Karachi)"
          className="flex-1 rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding}
          className="flex items-center gap-1.5 rounded-sm bg-gold px-4 py-2 font-utility text-xs font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright disabled:opacity-50"
        >
          <Plus size={14} /> Add
        </button>
      </form>

      <div className="overflow-x-auto rounded-sm border border-gold/15">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-ink-card text-cream-dim">
            <tr>
              <th className="px-4 py-3 font-utility text-xs uppercase">City</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Active</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Custom Fee (Rs.)</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {cities.map((city) => (
              <tr key={city.id}>
                <td className="px-4 py-3 text-cream">{city.name}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(city)}
                    disabled={busyId === city.id}
                    className={`rounded-sm px-2 py-1 font-utility text-[10px] uppercase tracking-wide ${
                      city.active ? "bg-green-500/15 text-green-400" : "bg-cream-dim/15 text-cream-dim"
                    }`}
                  >
                    {city.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="Default"
                    value={city.deliveryFee ?? ""}
                    onChange={(e) => updateFee(city, e.target.value)}
                    onBlur={() => saveFee(city)}
                    className="w-28 rounded-sm border border-gold/30 bg-ink px-2 py-1 text-cream focus:border-gold focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(city)}
                    disabled={busyId === city.id}
                    className="text-cream-dim hover:text-red-400 disabled:opacity-50"
                    aria-label={`Remove ${city.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-cream-dim">
                  No delivery cities yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
