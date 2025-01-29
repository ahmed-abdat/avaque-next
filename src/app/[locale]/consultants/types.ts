import { Database } from "@/types/database.types";

export type ConsultantProfile =
  Database["public"]["Tables"]["consultant_profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

export interface ConsultantWithReviews extends ConsultantProfile {
  reviews: Review[];
  rating?: number;
  totalSessions?: number;
}

// Helper function to calculate rating
export function calculateRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

// Mock data that matches our database types
export const mockConsultants: ConsultantWithReviews[] = [
  {
    id: "1",
    full_name: "Dr. Ahmed",
    email: "ahmed@example.com",
    specialization: "Physics",
    short_description: "PhD in Physics with expertise in quantum mechanics",
    bio_ar:
      "أساعد الطلبة في مادة الفيزياء الحديثة، خاصة في مواضيع الميكانيكا الكمية والديناميكا الحرارية. لدي خبرة في إعداد البحوث العلمية والإشراف عليها.",
    bio_fr:
      "J'aide les étudiants en physique moderne, notamment en mécanique quantique et thermodynamique. J'ai de l'expérience dans la rédaction et la supervision de recherches scientifiques.",
    avatar_url: "/consultants/avatar-1.jpg",
    hourly_rate: 50,
    role: "consultant",
    is_approved: true,
    meet_link: "https://meet.google.com/abc-defg-hij",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.8,
    totalSessions: 120,
    reviews: [
      {
        id: "review1",
        consultant_id: "1",
        student_id: "student1",
        booking_id: "booking1",
        rating: 5,
        comment: "Excellent consultant, very helpful!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "review2",
        consultant_id: "1",
        student_id: "student2",
        booking_id: "booking2",
        rating: 5,
        comment: "Great experience, highly recommended!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    full_name: "Dr. Sarah",
    email: "sarah@example.com",
    specialization: "Mathematics",
    short_description: "PhD in Mathematics specializing in advanced calculus",
    bio_ar:
      "متخصصة في الرياضيات المتقدمة، أساعد الطلاب في فهم التفاضل والتكامل والمعادلات التفاضلية.",
    bio_fr:
      "Spécialisée en mathématiques avancées, j'aide les étudiants à comprendre le calcul différentiel et intégral.",
    avatar_url: "/consultants/avatar-2.jpg",
    hourly_rate: 45,
    role: "consultant",
    is_approved: true,
    meet_link: "https://meet.google.com/xyz-uvwx-yz",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.9,
    totalSessions: 85,
    reviews: [
      {
        id: "review3",
        consultant_id: "2",
        student_id: "student3",
        booking_id: "booking3",
        rating: 5,
        comment: "Dr. Sarah is an excellent teacher!",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
];
