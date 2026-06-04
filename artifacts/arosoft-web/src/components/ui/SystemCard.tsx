import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export interface SystemCardProps {
  name: string;
  description: string;
  bestFor: string;
  price?: string;
}

export function SystemCard({ name, description, bestFor, price = "Request Quote" }: SystemCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <CardContent className="p-6 flex-1">
        <div className="mb-4">
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-none font-medium">
            Best for: {bestFor}
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{name}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="font-semibold text-slate-900">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{price}</Badge>
        </div>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-900 hover:bg-slate-50">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
