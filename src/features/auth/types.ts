export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    phone?: string;
    role: "student" | "consultant" | "admin";
    created_at: string;
    updated_at: string;
  }
  
  export interface ConsultantProfile extends User {
    specialization: string;
    short_description: string;
    bio_ar?: string;
    bio_fr?: string;
    meet_link?: string;
    is_approved: boolean;
  }