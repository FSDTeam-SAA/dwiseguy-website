import ProfileSidebar from "@/components/account/common/ProfileSidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/login.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 container mx-auto flex flex-col md:flex-row min-h-screen gap-12 py-12 px-6">

        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <ProfileSidebar />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}