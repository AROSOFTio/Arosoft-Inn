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
    <Card className="bg-card/50 backdrop-blur-sm border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
      <CardContent className="p-6 flex-1">
        <div className="mb-4">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none">
            {bestFor}
          </Badge>
        </div>
        <h3 className="text-xl font-bold mb-3">{name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {description}
        </p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <div className="font-semibold">{price}</div>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
