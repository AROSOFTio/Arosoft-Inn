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

interface PortfolioItem {
  id: string;
  title: string;
  projectType: string;
  category: string;
  description: string;
  clientName?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  imageUrls: string[];
  tags: string[];
  status: string;
  featured: boolean;
}

const statuses = ["DRAFT", "PUBLISHED", "HIDDEN"];

export default function AdminPortfolio() {
  const [, navigate] = useLocation();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [featured, setFeatured] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("/api/admin/portfolio", { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Unable to load portfolio.");
    const data = (await response.json()) as { items: PortfolioItem[] };
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setProjectType("");
    setCategory("");
    setDescription("");
    setClientName("");
    setLiveUrl("");
    setGithubUrl("");
    setImageUrls("");
    setTags("");
    setStatus("DRAFT");
    setFeatured(false);
    setFiles(null);
  }

  function edit(item: PortfolioItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setProjectType(item.projectType);
    setCategory(item.category);
    setDescription(item.description);
    setClientName(item.clientName || "");
    setLiveUrl(item.liveUrl || "");
    setGithubUrl(item.githubUrl || "");
    setImageUrls(item.imageUrls.join("\n"));
    setTags(item.tags.join(", "));
    setStatus(item.status);
    setFeatured(item.featured);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const token = getAuthToken();
    if (!token) return;

    const form = new FormData();
    form.set("title", title);
    form.set("projectType", projectType);
    form.set("category", category);
    form.set("description", description);
    form.set("clientName", clientName);
    form.set("liveUrl", liveUrl);
    form.set("githubUrl", githubUrl);
    form.set("imageUrls", imageUrls);
    form.set("tags", tags);
    form.set("status", status);
    form.set("featured", String(featured));
    Array.from(files ?? []).forEach((file) => form.append("images", file));

    const response = await fetch(editingId ? `/api/admin/portfolio/${editingId}` : "/api/admin/portfolio", {
      method: editingId ? "PATCH" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to save portfolio item.");
      return;
    }

    setNotice(editingId ? "Portfolio item updated." : "Portfolio item created.");
    resetForm();
    await load();
  }

  async function remove(itemId: string) {
    if (!window.confirm("Delete this portfolio item?")) return;
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`/api/admin/portfolio/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setError("Unable to delete portfolio item.");
      return;
    }
    await load();
  }

  return (
    <DashboardPageShell title="Portfolio" description="Create, upload, publish, hide, and feature portfolio work." allowedRoles={["SUPER_ADMIN", "ADMIN"]} menuItems={adminMenu}>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-3"><CardTitle>{editingId ? "Edit Portfolio Item" : "Create Portfolio Item"}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submit}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={projectType} onChange={(event) => setProjectType(event.target.value)} placeholder="Project type" required />
                <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" required />
              </div>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="min-h-24" required />
              <Input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Client name optional" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={liveUrl} onChange={(event) => setLiveUrl(event.target.value)} placeholder="Live link" />
                <Input value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} placeholder="GitHub link" />
              </div>
              <Textarea value={imageUrls} onChange={(event) => setImageUrls(event.target.value)} placeholder="Image URLs, one per line" className="min-h-20" />
              <Input type="file" multiple accept="image/*" onChange={(event) => setFiles(event.target.files)} />
              <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags separated by commas" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Checkbox checked={featured} onCheckedChange={(checked) => setFeatured(Boolean(checked))} />
                  Featured
                </label>
              </div>
              <div className="flex gap-3">
                <Button>{editingId ? "Update Item" : "Create Item"}</Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-3"><CardTitle>Portfolio Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.projectType} / {item.category}</p>
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 md:items-end">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
                    {item.featured && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Featured</span>}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => edit(item)}>Edit</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => remove(item.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-slate-500">No portfolio items yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
