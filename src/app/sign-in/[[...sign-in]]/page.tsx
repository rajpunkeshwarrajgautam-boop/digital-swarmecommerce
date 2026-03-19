import { SignIn } from "@clerk/nextjs";
import { Terminal, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Noise and Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-5 pointer-events-none" />

      {/* Tactical Header */}
      <div className="mb-12 relative z-10 text-center">
        <Link href="/" className="inline-block px-4 py-1 border-2 border-[#CCFF00] bg-black text-[#CCFF00] text-[10px] font-black tracking-[4px] uppercase italic -rotate-2 shadow-[4px_4px_0_#CCFF00] mb-6 hover:translate-y-1 hover:shadow-none transition-all">
          RETREAT_TO_BASE
        </Link>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase drop-shadow-[4px_4px_0_#CCFF00] leading-none mb-2">
          IDENT_LOGIN
        </h1>
        <div className="flex items-center justify-center gap-2 text-[#CCFF00] font-black text-[10px] tracking-widest uppercase">
          <Terminal className="w-4 h-4" /> SECURE_UPLINK_ESTABLISHED
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white border-8 border-black shadow-[20px_20px_0_#CCFF00] p-2">
        <div className="absolute -top-6 -right-6 bg-black text-[#CCFF00] border-4 border-black px-4 py-2 font-black italic text-xs uppercase tracking-tighter shadow-[4px_4px_0_#fff]">
          UPLINK_READY
        </div>
        
        <SignIn 
          path="/sign-in" 
          routing="path" 
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary: "bg-black hover:bg-black text-[#CCFF00] border-4 border-black shadow-[4px_4px_0_#CCFF00] hover:translate-y-1 hover:shadow-none transition-all font-black uppercase italic tracking-tighter py-3",
              card: "shadow-none border-0 bg-transparent p-6",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-4 border-black shadow-[4px_4px_0_#000] rounded-none font-black uppercase text-xs tracking-tighter",
              formFieldInput: "border-4 border-black rounded-none p-4 focus:bg-[#CCFF00] focus:ring-0 font-black",
              footerActionLink: "text-black font-black underline decoration-4 decoration-[#CCFF00] hover:bg-[#CCFF00]",
              dividerLine: "bg-black h-1",
              dividerText: "font-black text-black uppercase text-xs"
            }
          }}
        />
      </div>

      {/* Security Footer */}
      <div className="mt-12 relative z-10 flex items-center gap-4 bg-[#f0f0f0] border-4 border-black p-4 shadow-[8px_8px_0_#000]">
        <ShieldCheck className="w-8 h-8 text-black fill-[#CCFF00]" />
        <p className="font-black uppercase text-[10px] tracking-widest text-black/70 italic leading-tight">
          SHA-256 Encrypted Auth Node.<br/>Zero Knowledge Protocol Active.
        </p>
      </div>

      {/* Cyber Decor */}
      <div className="absolute bottom-10 left-10 font-black italic text-4xl text-white/5 select-none pointer-events-none">
        UPLINK_STABLE
      </div>
    </div>
  );
}
