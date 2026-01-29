import { api } from "@/lib/api";

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const res = await api.post("/contact-us", data);
    return res.data;
  } catch (err) {
    console.error("Error submitting contact form:", err);
    throw err;
  }
}
