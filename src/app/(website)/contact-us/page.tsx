import Login from "@/features/auth/component/Login";
import { ContactForm } from "@/features/contact/components/ContactForm";

export default function page() {
  return (
    <div className="h-screen w-screen bg-[url('/images/login.jpg')] bg-cover bg-center mt-0!">
      <ContactForm />
      {/* <ContactInformation /> */}
    </div>
  );
}
