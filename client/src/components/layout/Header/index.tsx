import { Logo } from "@/components";
import { ThemeToggle } from "./ThemeToggle";
import { NowPlayingWidget } from "@/features";

export function Header() {
  return (
    <header className="bg-base-100 shadow-md px-4" data-testid="tracks-header">
      <div className="flex flex-wrap items-center justify-between gap-2 py-2">
        <Logo />

        <div className="order-3 w-full sm:order-2 sm:w-auto">
          <NowPlayingWidget />
        </div>

        <div className="order-2 sm:order-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
