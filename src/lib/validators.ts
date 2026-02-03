import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const UniversitySchema = z.object({
  name: z.string().min(2, "University name must be at least 2 characters."),
  short_code: z.string().min(2, "Short code must be at least 2 characters."),
  website: z.string().url("Invalid URL format").optional().or(z.literal('')),
  logo_url: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email format."),
  role: z.enum(["super_admin", "dean", "data_entry"]),
  university_id: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.role !== "super_admin" && !data.university_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "University is required for non-super_admin roles.",
      path: ["university_id"],
    });
  }
});

export const MeetingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm format."),
  location: z.string().optional().or(z.literal('')),
  agenda_details: z.string().optional().or(z.literal('')),
  agenda_file_url: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  minutes_details: z.string().optional().or(z.literal('')),
  minutes_file_url: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  attendees: z.string().optional().or(z.literal('')), // Storing as string
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]).default("PENDING"),
  university_id: z.string().min(1, "University is required."), // Made university_id required
});

export const StaffSchema = z.object({
  name: z.string().min(2, "Staff name must be at least 2 characters."),
  position: z.string().min(1, "Position is required."),
  department: z.string().min(1, "Department is required."),
  faculty: z.string().optional().or(z.literal('')), // New field
  expertise: z.string().optional().or(z.literal('')),
  email: z.string().email("Invalid email format.").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')), // New field
  image_url: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  university_id: z.string().min(1, "University is required."),
});

export const ResearchProjectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters."),
  collaborators: z.array(z.string()).optional().default([]),
  status: z.string().optional().or(z.literal("")), // E.g., "Ongoing", "Completed"
  description: z.string().optional().or(z.literal("")),
  staff_id: z.string().min(1, "Staff ID is required."),
});

export const CompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  sector: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  contact_person: z.string().min(1, "Contact person is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Invalid email format.").optional().or(z.literal('')),
  website: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  image_url: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  university_id: z.string().min(1, "University is required."),
});

export const IndustryActivitySchema = z.object({
  project_name: z.string().min(3, "Project name must be at least 3 characters."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  status: z.string().min(1, "Status is required."),
  action: z.string().optional().or(z.literal('')),
  pic_company: z.string().min(1, "Company PIC is required."),
  pic_university: z.string().min(1, "University PIC is required."),
  company_id: z.string().min(1, "Company ID is required."),
  university_id: z.string().min(1, "University ID is required."),
});

export const FacilitySchema = z.object({
  name: z.string().min(2, "Facility name must be at least 2 characters."),
  description: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  image_url: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  university_id: z.string().min(1, "University is required."),
});

export const ChangePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  confirmPassword: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phoneNumber: z.string().optional().or(z.literal('')),
});
