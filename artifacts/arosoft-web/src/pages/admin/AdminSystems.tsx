import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SystemItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  startingPrice?: string | null;
  imageUrl?: string | null;
  status: string;
  featured: boolean;
}

const statuses = ["DRAFT", "PUBLISHED", "HIDDEN"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminSystems() {
  const [, navigate] = useLocation();
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("/api/admin/systems", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load systems.");
    const data = (await response.json()) as { systems: SystemItem[] };
    setSystems(data.systems);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("");
    setDescription("");
    setFeatures("");
    setStartingPrice("");
    setImageUrl("");
    setStatus("DRAFT");
    setFeatured(false);
  }

  function edit(system: SystemItem) {
    setEditingId(system.id);
    setTitle(system.title);
    setSlug(system.slug);
    setCategory(system.category);
    setDescription(system.description);
    setFeatures(system.features.join("\n"));
    setStartingPrice(system.startingPrice || "");
    setImageUrl(system.imageUrl || "");
    setStatus(system.status);
    setFeatured(system.featured);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const token = getAuthToken();
    if (!token) return;

    const payload = {
      title,
      slug: slug || slugify(title),
      category,
      description,
      features,
      startingPrice,
      imageUrl,
      status,
      featured,
    };
    const response = await fetch(editingId ? `/api/admin/systems/${editingId}` : "/api/admin/systems", {
      method: editingId ? "PATCH" : "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to save system.");
      return;
    }

    setNotice(editingId ? "System updated." : "System created.");
    resetForm();
    await load();
  }

  async function remove(systemId: string) {
    if (!window.confirm("Delete this system?")) return;
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`/api/admin/systems/${systemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setError("Unable to delete system.");
      return;
    }
    await load();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>{editingId ? "Edit System" : "Create System"}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
              <Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="slug" />
              <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="min-h-28" required />
              <Textarea value={features} onChange={(event) => setFeatures(event.target.value)} placeholder="Features, one per line" className="min-h-24" />
              <Input value={startingPrice} onChange={(event) => setStartingPrice(event.target.value)} placeholder="Starting price" />
              <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Image URL" />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Checkbox checked={featured} onCheckedChange={(checked) => setFeatured(Boolean(checked))} />
                Featured on homepage
              </label>
              <div className="flex gap-3">
                <Button>{editingId ? "Update System" : "Create System"}</Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Systems</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {systems.map((system) => (
              <div key={system.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{system.title}</p>
                    <p className="text-sm text-slate-600">{system.category} / {system.slug}</p>
                    <p className="mt-2 text-sm text-slate-600">{system.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 md:items-end">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{system.status}</span>
                    {system.featured && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Featured</span>}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => edit(system)}>Edit</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => remove(system.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {systems.length === 0 && <p className="text-sm text-slate-500">No systems yet.</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
