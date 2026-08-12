"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { Plus, PawPrint } from "lucide-react";

const pets = [
  { id: "1", name: "Luna", breed: "Golden Retriever", age: "2 Anos", weight: "28.4 kg", chip: "985112006456221", status: "Saudável", img: "🐕" },
  { id: "2", name: "Oliver", breed: "Beagle", age: "4 Anos", weight: "12.5 kg", chip: "985112006456231", status: "Alerta", img: "🐈" },
];

export default function PetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Meus Pets</h1>
          <p className="text-on-surface-variant mt-1">Gerencie os perfis dos residentes do seu santuário.</p>
        </div>
        <button className="bg-primary-gradient text-on-primary font-headline font-semibold py-3 px-5 rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center gap-2 text-sm">
          <Plus size={18} />
          Adicionar Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Link key={pet.id} href={`/pets/${pet.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                  {pet.img}
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">{pet.name}</h3>
                  <p className="text-sm text-on-surface-variant">{pet.breed}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-on-surface-variant">Idade</p>
                  <p className="font-semibold">{pet.age}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Peso</p>
                  <p className="font-semibold">{pet.weight}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${pet.status === "Saudável" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                  {pet.status}
                </span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <PawPrint size={12} /> Chip: ...{pet.chip.slice(-4)}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
