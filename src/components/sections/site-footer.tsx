import { Logo } from "../ui/logo"
import Link from "next/link";

export default function SiteFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="mt-10 border-t border-border/60 bg-background/90">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <Link href='/' className="flex items-center gap-4">
                        <div className="relative">
                            <Logo className="w-12 h-12" variant="professional" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CEF431] animate-pulse" />
                        </div>
                        <div>
                            <h1 className="font-bold text-[#CEF431] tracking-tight">AutoWorld</h1>
                            <p className="text-xs text-[#CEF431]/60">Enterprise Automation Hub</p>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                    <span className="text-[#CEF431]/60">© {currentYear} AutoWorld. 모든 권리 보유.</span>
                </div>
            </div>
        </footer>
    )
}