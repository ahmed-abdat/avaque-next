# 1. **Project Overview**

**Project Name:** **Avaqe** (example name)

**Project Goal:**  
Avaqe is a platform designed to connect regular students (seeking academic guidance) with **Master’s and Doctoral students** (consultants) who can provide specialized help. This could include:
- Advising on academic specialization choices.  
- Providing assistance with exercises, projects, or thesis-related questions.  
- Offering 1-on-1 consulting sessions (via video calls).  

**Business Logic Highlights:**  
1. **User Roles**:  
   - **Student (Client)**: Registers to request consultations, pays manually (bank transfer), uploads proof, and rates consultants.  
   - **Consultant (Master/PhD Student)**: Applies to join, upon approval can set availability, manage bookings, and conduct sessions via Google Meet.  
   - **Admin**: Oversees platform operations, approves consultant applications, confirms payment proofs, monitors ratings, and manages overall analytics.

2. **Multi-Language**:  
   - The platform must support **Arabic** and **French** for consultant bios, and potentially for the entire UI.

3. **Payment Process**:  
   - Manual bank transfer. The user uploads payment proof (screenshot).  
   - Admin checks and confirms before finalizing the booking.

4. **Ratings & Reviews**:  
   - After a session, students can leave a rating and a review for the consultant, which the admin can monitor.

5. **Technology Stack**:
   - **Front-End**: Next.js 14, Tailwind CSS + any UI library (e.g., Shadcn UI).  
   - **Database**: Supabase (Postgres).  
   - **File/Media Storage**: Supabase Storage for payment proofs and profile pictures.  
   - **Auth**: Supabase Auth (or NextAuth if preferred, but here we assume Supabase).  
   - **Email Sending**: **EmailJS** (to handle booking confirmations, payment status updates, etc.).  

---

# 2. **System Architecture**

Below is a high-level outline showing how the pieces interact:

1. **Next.js App**: Deployed (e.g., on Vercel).  
   - **Public Pages** (Landing, Specializations, Consultant Profiles).  
   - **Dashboard Pages** (for Admin, Consultant, and Student).  
   - **API Routes / Server Actions** to interact with Supabase (CRUD operations, payment confirmation logic, etc.).

2. **Supabase**:  
   - **Postgres Database**: Holds user data, consultant details, bookings, payments, reviews, etc.  
   - **Auth**: Handles user registration, login, and roles (student/consultant/admin).  
   - **Storage**: Hosts proof-of-payment images and profile pictures.

3. **EmailJS**:  
   - Used in Next.js to send automated or triggered emails (booking confirmations, reminders, payment verification notices).

4. **Optional External Integrations**:  
   - **Google Meet**: Consultants share meeting links.  
   - **Analytics**: Could be Google Analytics or an alternative for usage tracking.

---

# 3. **Dashboards to Build**

## 3.1 **Admin Dashboard**

**Main Responsibilities**  
1. **Consultant Approvals**:  
   - View list of consultant applications (CV, experience, bilingual bio).  
   - Approve or reject the application.  
   - Once approved, the user role changes from `student` to `consultant`.  

2. **Payment Proof Management**:  
   - A section to see recent payment screenshots for bookings in “Pending Payment Confirmation” status.  
   - Admin can approve or reject payment proofs.  

3. **Platform Analytics** (basic or advanced):  
   - Number of total bookings, completed bookings, total revenue.  
   - Consultant ratings and feedback.  
   - Potentially see top-rated consultants or most active consultants.  

4. **User Management**:  
   - View all users (students and consultants), block users if needed.  
   - Possibly reset passwords or assist with account issues.

**Technical Implementation**  
- **Pages or Routes**:  
  - `/admin/dashboard` (overview)  
  - `/admin/consultants` (manage approvals)  
  - `/admin/payments` (confirm payment proofs)  
  - `/admin/analytics` (charts or simple stats)  
- **Access Control**:  
  - Configure server-side or route middleware to allow only `admin` role.  
  - In Supabase, you can store `role` in user metadata and check it in your route handlers.

---

## 3.2 **Consultant Dashboard**

**Main Responsibilities**  
1. **Profile & Availability**:  
   - Set or update bilingual bio (Arabic, French), profile image, and hourly rate.  
   - Possibly define available time slots or a personal schedule calendar.  

2. **Booking Requests**:  
   - See new consultation requests.  
   - Confirm or reject requests (or wait for payment confirmation if that’s your flow).  
   - Provide the Google Meet link once the booking is paid/confirmed.  

3. **Session Management**:  
   - Mark a session as completed after the consultation.  

4. **Earnings / Booking History**:  
   - View the total number of completed sessions, total earnings, and any analytics that might help the consultant.

**Technical Implementation**  
- **Pages or Routes**:  
  - `/dashboard` or `/consultant/dashboard` (home overview)  
  - `/consultant/requests` (booking requests)  
  - `/consultant/profile` (bio, language fields, rate, etc.)  
  - `/consultant/history` (past sessions, possible earnings breakdown)  

- **Data Flows**:  
  - **Bookings** table references the consultant ID.  
  - Consultant filters or queries bookings where `consultant_id = [their ID]`.  
  - **Payment** status: only see “Confirmed” bookings once the admin has validated proof.

---

## 3.3 **Student (User) Dashboard**

**Main Responsibilities**  
1. **Search & Book Consultants**:  
   - Browse specializations.  
   - See consultants’ bios (Arabic/French) and ratings.  
   - Initiate booking request for a chosen time slot or date.  

2. **Payment Proof Upload**:  
   - After choosing a consultant and finalizing the booking price, user uploads the screenshot of the bank transfer.  
   - Wait for admin confirmation.  

3. **Booking Status & History**:  
   - See if a booking is pending payment confirmation, confirmed, completed, or canceled.  
   - Download/see meeting link once booking is confirmed.  

4. **Rating & Review**:  
   - After session completion, the user can provide a rating and optional text review.

**Technical Implementation**  
- **Pages or Routes**:  
  - `/student/dashboard` (overview of upcoming bookings)  
  - `/student/bookings` or integrated into the same dashboard page  
  - `/student/profile` (basic profile management)  
  - Optionally, `/(public)specializations` or `/(public)consultants` for browsing before logging in, with a prompt to log in to book.

- **Data Flows**:  
  - **Bookings**: user sees only bookings where `student_id = [their ID]`.  
  - **Payment**: upload flow through a Next.js API route that stores the image in Supabase Storage and updates the database record.

---

# 4. **Detailed Technical Steps**

Below is a step-by-step outline for building **Phase 1** of the dashboards.

## 4.1 **Project Initialization**

1. **Create Next.js 14 Project**:  
   ```bash
   npx create-next-app@latest avaqe --experimental-app
   cd avaqe
   ```
2. **Install Dependencies**:  
   ```bash
   # For styling and UI
   npm install tailwindcss postcss autoprefixer shadcn-ui
   
   # For Supabase
   npm install @supabase/supabase-js
   
   # For EmailJS
   npm install emailjs-com
   ```
3. **Configure Tailwind**:  
   - Generate Tailwind config files:
     ```bash
     npx tailwindcss init -p
     ```
   - Add the Tailwind directives in `globals.css`.

4. **Set Environment Variables**:  
   - **SUPABASE_URL**  
   - **SUPABASE_ANON_KEY** (or service role if needed)  
   - **EMAILJS variables** (e.g., `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`)

## 4.2 **Set Up Supabase**

1. **Create a Project** in [Supabase](https://app.supabase.com/).  
2. **Configure Auth**:  
   - Enable Email/Password sign-ups.  
   - Optionally enable social logins if desired.  
3. **Database Schema** (example, minimal approach):

```sql
-- USERS
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',  -- 'student', 'consultant', 'admin'
  created_at TIMESTAMP DEFAULT now()
);

-- CONSULTANTS
-- Could store consultant-specific fields in a separate table or within "users" by role
CREATE TABLE consultants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users (id) ON DELETE CASCADE,
  specialization TEXT,  -- e.g. 'Computer Science', 'Literature', ...
  bio_ar TEXT,          -- Arabic bio
  bio_fr TEXT,          -- French bio
  hourly_rate NUMERIC(10,2),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- BOOKINGS
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users (id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES consultants (id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',  -- 'pending', 'payment_confirmed', 'completed', 'canceled'
  scheduled_time TIMESTAMP,       -- date/time of the consult
  created_at TIMESTAMP DEFAULT now()
);

-- PAYMENTS
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings (id) ON DELETE CASCADE,
  amount NUMERIC(10,2),
  payment_proof_url TEXT, -- link to uploaded image in Supabase Storage
  confirmed_by uuid REFERENCES users (id), -- admin who confirms
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- REVIEWS
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings (id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES consultants (id) ON DELETE CASCADE,
  student_id uuid REFERENCES users (id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

*(Adjust field types to match your preferences. You can also store consultant data in the `users` table directly if you prefer.)*

## 4.3 **Implement Authentication Logic**

- **Option A**: Use **Supabase Auth** directly.  
  - In Next.js, create a `supabaseClient.js` that initializes the client:
    ```js
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```
  - For server-side usage, you might use a service role key or rely on the same key carefully.  
  - Handle session checks on protected routes (e.g., using middleware or server-side checks in your page components).

- **Option B**: If you prefer to store auth data in your own tables, you can, but Supabase already does it well.

## 4.4 **Dashboard Pages & Components**

### **A. Admin Dashboard**

1. **Route**: `/admin` or `/admin/dashboard`
2. **Features**:  
   - Show high-level stats (bookings, revenue, pending approvals).  
   - Navigation to:  
     - **Consultant Approvals**: fetch all `consultants` with `is_approved = false`.  
       - Approve -> set `is_approved = true`.  
       - Possibly update the user’s role to `consultant`.  
     - **Payment Confirmations**: list payments with `confirmed_by = NULL`.  
       - Upon admin approval, set `confirmed_by = admin_id` and `confirmed_at = now()`.  
       - Update `bookings.status = 'payment_confirmed'`.  
     - **Ratings/Reviews**: monitor recent reviews, handle flagged issues.  

3. **Implementation**:  
   - Use Next.js Server Components or Server Actions to fetch data from Supabase.  
   - Protect these pages with an admin role check.

### **B. Consultant Dashboard**

1. **Route**: `/consultant/dashboard`
2. **Features**:  
   - **Profile**: Display/update `bio_ar`, `bio_fr`, `hourly_rate`, profile pic.  
   - **Availability**: Possibly store time slots or next available schedule.  
   - **Booking Requests**:  
     - Show list of bookings where `consultant_id = [this consultant]`.  
     - Filter by status: `'pending'`, `'payment_confirmed'`, `'completed'`, etc.  
     - Provide a button to “Share Meeting Link” or to mark as completed.  
   - **History & Earnings**:  
     - Summaries of completed bookings, total amounts earned, average rating, etc.

### **C. Student/User Dashboard**

1. **Route**: `/student/dashboard`
2. **Features**:  
   - **Browse Consultants** (or you can do this on a public page and prompt login on booking).  
   - **Current Bookings**:  
     - Show upcoming sessions, booking statuses.  
     - If `status = 'pending'`, prompt user to upload payment proof.  
   - **Payment Proof Upload**:  
     - A simple form that sends the screenshot to Supabase Storage.  
     - Creates/updates the corresponding record in `payments`.  
   - **Booking History**:  
     - Past sessions with an option to rate the consultant if the rating wasn’t provided yet.  

---

## 4.5 **EmailJS Integration**

You can use **EmailJS** to send notifications such as:

1. **Booking Confirmation** to a user (when they create a booking or when payment is confirmed).  
2. **Consultant Notification** (when a new booking request is made).  
3. **Password Reset or Registration Welcomes** (optional).

**Steps to Set Up**:
1. Create an **EmailJS** account, obtain:
   - **Service ID**  
   - **Template ID**  
   - **Public Key**  
2. In your Next.js code, you can make client-side calls to EmailJS or call from server actions. For example:
   ```js
   import emailjs from 'emailjs-com';

   async function sendBookingConfirmation(toEmail, bookingData) {
     const templateParams = {
       to_email: toEmail,
       subject: 'Booking Confirmation',
       message: `Your booking with ID ${bookingData.id} is confirmed!`
     };

     const result = await emailjs.send(
       process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
       templateParams,
       process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
     );
     return result;
   }
   ```
3. Ensure you store your EmailJS keys in `.env.local`.

---

# 5. **Multi-Language (Arabic & French)**

1. **Consultant Bios**:  
   - Store `bio_ar` and `bio_fr` in the database.  
   - The UI can detect the user’s language setting (either from the browser or a toggle) and show the corresponding field.

2. **UI Text**:  
   - Implement Next.js i18n or a library like **`next-i18next`** to store translations in separate files (e.g., `ar.json`, `fr.json`).  
   - Wrap your pages in a `<TranslationProvider>` so that users can switch languages.

---

# 6. **Security & Role-Based Access**

1. **Role Checking**:  
   - On each server action or API route, verify the user’s role via Supabase session or the stored user metadata.  
   - For example, `admin` routes should reject any user not in `admin` role.  
2. **Row Level Security (RLS)** (Optional, advanced):  
   - In Supabase, you can enable RLS for certain tables so that users only read or write the rows that belong to them (e.g., a user can only see their own bookings).

---

# 7. **Deployment & Testing**

1. **Local Testing**:  
   - Run `npm run dev`.  
   - Test sign-up, booking flows, payment proof uploads, etc.  
2. **Deployment**:  
   - Deploy the Next.js app on **Vercel** (free tier).  
   - Link environment variables for Supabase and EmailJS in the Vercel dashboard.  
3. **Supabase**:  
   - The free tier will handle your initial usage. Keep an eye on DB size and monthly active connections.

---

# 8. **Summary & Next Steps**

1. **Start With the Core**:  
   - Set up your project skeleton (database tables, basic Next.js pages).  
   - Implement user sign-up and role assignments (`student`, `consultant`, `admin`).  
2. **Build Dashboards**:  
   - Create separate routes for Admin, Consultant, and Student dashboards.  
   - Focus on the data flows (booking, payment verification).  
3. **Integrate EmailJS** for critical notifications.  
4. **Add Polish**:  
   - Multi-language UI, advanced analytics, a more sophisticated scheduling system (if you want time slot selection).  
   - Refine the design (Shadcn UI, Tailwind) for a consistent, modern look.

