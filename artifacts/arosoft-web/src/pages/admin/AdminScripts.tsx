import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { adminMenu } from "@/components/dashboard/dashboardData";

interface ScriptTemplate {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  previewUrl?: string | null;
  downloadUrl?: string | null;
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

export default function AdminScripts() {
  const [, navigate] = useLocation();
  const [scripts, setScripts] = useState<ScriptTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("$5");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
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

    const response = await fetch("/api/admin/scripts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load scripts.");
    const data = (await response.json()) as { scripts: ScriptTemplate[] };
    setScripts(data.scripts);
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
    setPrice("$5");
    setPreviewUrl("");
    setDownloadUrl("");
    setImageUrl("");
    setStatus("DRAFT");
    setFeatured(false);
  }

  function edit(script: ScriptTemplate) {
    setEditingId(script.id);
    setTitle(script.title);
    setSlug(script.slug);
    setCategory(script.category);
    setDescription(script.description);
    setPrice(script.price);
    setPreviewUrl(script.previewUrl || "");
    setDownloadUrl(script.downloadUrl || "");
    setImageUrl(script.imageUrl || "");
    setStatus(script.status);
    setFeatured(script.featured);
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
      price,
      previewUrl,
      downloadUrl,
      imageUrl,
      status,
      featured,
    };
    const response = await fetch(editingId ? `/api/admin/scripts/${editingId}` : "/api/admin/scripts", {
      method: editingId ? "PATCH" : "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to save script.");
      return;
    }

    setNotice(editingId ? "Script updated." : "Script created.");
    resetForm();
    await load();
  }

  async function remove(scriptId: string) {
    if (!window.confirm("Delete this script template?")) return;
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`/api/admin/scripts/${scriptId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setError("Unable to delete script.");
      return;
    }
    await load();
  }

  return (
    <DashboardPageShell
      title="Scripts"
      description="Create, publish, hide, and feature script templates."
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
      menuItems={adminMenu}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>{editingId ? "Edit Script" : "Create Script"}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
              <Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="slug" />
              <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="min-h-28" required />
              <Input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Price, e.g. $5" required />
              <Input value={previewUrl} onChange={(event) => setPreviewUrl(event.target.value)} placeholder="Preview URL" />
              <Input value={downloadUrl} onChange={(event) => setDownloadUrl(event.target.value)} placeholder="Download URL" />
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
                <Button>{editingId ? "Update Script" : "Create Script"}</Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Script Templates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {scripts.map((script) => (
              <div key={script.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{script.title}</p>
                    <p className="text-sm text-slate-600">{script.category} / {script.slug} / {script.price}</p>
                    <p className="mt-2 text-sm text-slate-600">{script.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 md:items-end">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{script.status}</span>
                    {script.featured && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Featured</span>}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => edit(script)}>Edit</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => remove(script.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {scripts.length === 0 && <p className="text-sm text-slate-500">No script templates yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
