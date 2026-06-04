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

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  price: string;
  isFree: boolean;
  isPremium: boolean;
  status: string;
  featured: boolean;
}

const statuses = ["DRAFT", "PUBLISHED", "HIDDEN"];
const levels = ["Beginner", "Intermediate", "Advanced"];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

interface LessonPayload {
  title: string;
  content: string;
  order: number;
}

function parseLessons(value: string): LessonPayload[] {
  return value
    .split("\n")
    .map((line, index) => {
      const [title, ...contentParts] = line.split("|");
      return title?.trim()
        ? { title: title.trim(), content: contentParts.join("|").trim() || "Lesson content will be added by the academy team.", order: index + 1 }
        : null;
    })
    .filter((lesson): lesson is LessonPayload => Boolean(lesson));
}

export default function AdminCourses() {
  const [, navigate] = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("$0");
  const [isFree, setIsFree] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [featured, setFeatured] = useState(false);
  const [lessons, setLessons] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const response = await fetch("/api/admin/courses", { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Unable to load courses.");
    const data = (await response.json()) as { courses: Course[] };
    setCourses(data.courses);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("");
    setLevel("Beginner");
    setDuration("");
    setDescription("");
    setPrice("$0");
    setIsFree(true);
    setIsPremium(false);
    setStatus("DRAFT");
    setFeatured(false);
    setLessons("");
  }

  async function edit(course: Course) {
    const token = getAuthToken();
    if (!token) return;
    setEditingId(course.id);
    setTitle(course.title);
    setSlug(course.slug);
    setCategory(course.category);
    setLevel(course.level);
    setDuration(course.duration);
    setDescription(course.description);
    setPrice(course.price);
    setIsFree(course.isFree);
    setIsPremium(course.isPremium);
    setStatus(course.status);
    setFeatured(course.featured);
    const response = await fetch(`/api/admin/courses/${course.id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (response.ok) {
      const data = (await response.json()) as { lessons: Array<{ title: string; content: string }> };
      setLessons(data.lessons.map((lesson) => `${lesson.title}|${lesson.content}`).join("\n"));
    }
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
      level,
      duration,
      description,
      price,
      isFree,
      isPremium,
      status,
      featured,
      lessons: parseLessons(lessons),
    };
    const response = await fetch(editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses", {
      method: editingId ? "PATCH" : "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to save course.");
      return;
    }
    setNotice(editingId ? "Course updated." : "Course created.");
    resetForm();
    await load();
  }

  async function remove(courseId: string) {
    if (!window.confirm("Delete this course?")) return;
    const token = getAuthToken();
    if (!token) return;
    const response = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      setError("Unable to delete course.");
      return;
    }
    await load();
  }

  return (
    <DashboardPageShell title="Courses" description="Create, edit, publish, and feature academy courses." allowedRoles={["SUPER_ADMIN", "ADMIN"]} menuItems={adminMenu}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-3"><CardTitle>{editingId ? "Edit Course" : "Create Course"}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submit}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
              <Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="slug" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" required />
                <Select value={level} onValueChange={setLevel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{levels.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
              </div>
              <Input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Duration, e.g. 4 weeks" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="min-h-24" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Price" />
                <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
              </div>
              <Textarea value={lessons} onChange={(event) => setLessons(event.target.value)} placeholder="Lessons, one per line: Title|Content" className="min-h-28" />
              <div className="grid gap-2 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={isFree} onCheckedChange={(checked) => setIsFree(Boolean(checked))} /> Free</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={isPremium} onCheckedChange={(checked) => setIsPremium(Boolean(checked))} /> Premium</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={featured} onCheckedChange={(checked) => setFeatured(Boolean(checked))} /> Featured</label>
              </div>
              <div className="flex gap-3">
                <Button>{editingId ? "Update Course" : "Create Course"}</Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-3"><CardTitle>Courses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{course.title}</p>
                    <p className="text-sm text-slate-600">{course.category} / {course.level} / {course.price}</p>
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{course.description}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{course.status}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => edit(course)}>Edit</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => remove(course.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {courses.length === 0 && <p className="text-sm text-slate-500">No courses yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
