"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export function TestimonialsSection({ locale }: { locale: string }) {
  const t = useTranslations("Landing");

  const testimonials = [
    {
      name: t("testimonials.testimonial1.name"),
      title: t("testimonials.testimonial1.title"),
      content: t("testimonials.testimonial1.content"),
      rating: 5,
      image: "/testimonials/avatar-1.jpg",
    },
    {
      name: t("testimonials.testimonial2.name"),
      title: t("testimonials.testimonial2.title"),
      content: t("testimonials.testimonial2.content"),
      rating: 5,
      image: "/testimonials/avatar-2.jpg",
    },
    {
      name: t("testimonials.testimonial3.name"),
      title: t("testimonials.testimonial3.title"),
      content: t("testimonials.testimonial3.content"),
      rating: 5,
      image: "/testimonials/avatar-3.jpg",
    },
  ];

  return (
    <section className="relative py-12 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("testimonials.title")}
        </h2>
        <p className="max-w-[85%] text-lg leading-relaxed text-muted-foreground">
          {t("testimonials.description")}
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border bg-background/60 transition-all hover:border-primary/50 hover:bg-background/80"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 transition-transform group-hover:scale-110">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {testimonial.name}
                  </h3>
                  <CardDescription>{testimonial.title}</CardDescription>
                </div>
              </div>
              <div className="flex gap-0.5 pt-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary transition-all group-hover:scale-110"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
