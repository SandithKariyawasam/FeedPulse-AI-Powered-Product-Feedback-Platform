import FeedbackForm from "@/components/FeedbackForm";
import InsightCard from "@/components/InsightCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black selection:bg-amber-100 dark:selection:bg-amber-900/40">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent -z-10 pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 lg:p-24">
        {/* Logo/Header section */}
        <div className="mt-20 mb-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
            FeedPulse<span className="text-amber-500">.</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            Helping product teams build what matters next through
          </p>
        </div>

        {/* The Form */}
        <FeedbackForm />

        {/* The Insights Section */}
        <InsightCard />

        {/* Footer info */}
        <div className="mt-16 pb-20 flex items-center gap-8 text-sm font-medium text-zinc-400 dark:text-zinc-600">
          <span>Developed By Sandith Kariyawasam</span>
        </div>
      </main>
    </div>
  );
}
