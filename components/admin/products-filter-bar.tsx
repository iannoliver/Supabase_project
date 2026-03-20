"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Filters = {
  search: string;
  category: string;
  status: "all" | "active" | "inactive";
};

export function ProductsFilterBar({
  onChange,
}: {
  onChange: (filters: Filters) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<Filters["status"]>("all");
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    onChange({ search: debouncedSearch, category, status });
  }, [category, debouncedSearch, onChange, status]);

  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200/70 bg-white p-4 md:grid-cols-[1.2fr_0.8fr_0.6fr]">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
          placeholder="Buscar por nome"
        />
      </div>
      <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Filtrar por categoria" />
      <Select value={status} onChange={(event) => setStatus(event.target.value as Filters["status"])}>
        <option value="all">Todos os status</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </Select>
    </div>
  );
}
