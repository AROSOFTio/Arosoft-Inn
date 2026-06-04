import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Brain, CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  featured: boolean;
}

const features = [
  "Course lessons",
  "Student enrollments",
  "Progress tracking",
  "Quizzes",
  "Assignments",
  "Premium course locks",
];

export default function Academy() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const featuredCourses = useMemo(() => courses.filter((course) => course.featured).slice(0, 3), [courses]);

  useEffect(() => {
    fetch("/api/courses")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load courses.");
        return response.json() as Promise<{ courses: Course[] }>;
      })
      .then((data) => setCourses(data.courses))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="py-8 md:py-10 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 text-xs font-medium">
              Academy
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900">
              Learn practical digital skills.
            </h1>
            <p className="text-base text-slate-600 mb-5 max-w-2xl mx-auto">
              Browse free and premium courses, enroll as a student, view lessons, complete quizzes, and track progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#courses">
                <Button size="sm" className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium">Explore Courses</Button>
              </a>
              <Link href="/login">
                <Button variant="outline" size="sm" className="h-9 px-6 border-slate-200 text-slate-900 hover:bg-slate-100 font-medium">Student Login</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="courses" className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="Learning Paths" description="Published courses from the AROSOFT Academy." />
            {error && <p className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course) => (
                <Card key={course.id} className="bg-white border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-all rounded-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 font-medium border-none">
                        {course.level}
                      </Badge>
                      {course.isPremium ? (
                        <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">Premium</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Free</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{course.description}</p>
                    <div className="flex items-center text-sm text-slate-500 gap-2 font-medium">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                      <span className="text-slate-300">/</span>
                      <span>{course.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href={`/academy/${course.slug}`} className="w-full">
                      <Button className="w-full group font-medium bg-white text-slate-900 border border-slate-200 hover:bg-slate-50">
                        {course.isPremium && !course.isFree ? <Lock className="mr-2 h-4 w-4 text-slate-500" /> : <PlayCircle className="mr-2 h-4 w-4 text-slate-500" />}
                        View Course
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {courses.length === 0 && !error && <p className="text-center text-sm text-slate-500">Published courses will appear here.</p>}
          </div>
        </section>

        {featuredCourses.length > 0 && (
          <section className="py-8 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
            <div className="container mx-auto">
              <SectionHeader title="Featured Courses" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featuredCourses.map((course) => (
                  <Card key={course.id} className="border-slate-200 bg-white">
                    <CardContent className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{course.category}</p>
                      <h3 className="mt-2 font-bold text-slate-950">{course.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{course.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 mb-4 border border-blue-200">
                <Brain size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                Built for measurable progress.
              </h2>
              <p className="text-sm text-slate-600 mb-5">
                Student dashboards connect enrollments, lessons, quizzes, assignments, and completion tracking.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg">
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-950">Student flow</p>
                  <p className="mt-1 text-sm text-slate-600">Enroll, learn, take quizzes, complete assignments, and track progress.</p>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                  <p className="text-sm font-semibold text-blue-700">Premium access</p>
                  <p className="mt-1 text-sm text-slate-700">Premium courses are visible but locked until payment is added.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
