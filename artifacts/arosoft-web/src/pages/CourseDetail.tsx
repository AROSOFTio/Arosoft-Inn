import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Lock, PlayCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthToken } from "@/lib/auth";

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
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string | null;
  order: number;
}

export default function CourseDetail() {
  const [, params] = useRoute("/academy/:slug");
  const [, navigate] = useLocation();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/courses/${params.slug}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Course not found.");
        return response.json() as Promise<{ course: Course; lessons: Lesson[] }>;
      })
      .then((data) => {
        setCourse(data.course);
        setLessons(data.lessons);
      })
      .catch((err: Error) => setError(err.message));
  }, [params?.slug]);

  async function enroll() {
    setError("");
    setNotice("");
    if (!course) return;
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch(`/api/student/courses/${course.id}/enroll`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to enroll.");
      return;
    }
    setNotice("Enrollment created. Open My Learning to start.");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="py-8 md:py-10 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto max-w-4xl">
            {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {course && (
              <>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  {course.isPremium ? <Badge className="bg-violet-50 text-violet-700 hover:bg-violet-100">Premium</Badge> : <Badge className="bg-green-50 text-green-700 hover:bg-green-100">Free</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
                <p className="mt-3 max-w-2xl text-slate-600">{course.description}</p>
                <p className="mt-3 text-sm text-slate-500">{course.duration} / {course.price}</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  {course.isPremium && !course.isFree ? (
                    <Button disabled className="bg-slate-200 text-slate-500">
                      <Lock className="mr-2 h-4 w-4" />
                      Premium Locked
                    </Button>
                  ) : (
                    <Button onClick={enroll} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Enroll Free
                    </Button>
                  )}
                  <Link href="/student/learning">
                    <Button variant="outline">My Learning</Button>
                  </Link>
                </div>
                {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}
              </>
            )}
          </div>
        </section>
        <section className="py-8 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-slate-200 bg-white">
              <CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="font-semibold text-slate-950">{lesson.order}. {lesson.title}</p>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{lesson.content}</p>
                  </div>
                ))}
                {lessons.length === 0 && <p className="text-sm text-slate-500">Lessons will be added by the academy team.</p>}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
