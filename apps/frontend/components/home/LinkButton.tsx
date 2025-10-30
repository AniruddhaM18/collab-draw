"use client";
import { Button } from "@repo/ui/components/button";
import { redirect, RedirectType } from "next/navigation";
import { ReactNode } from "react";

export interface LinkButtonprops {
  children: ReactNode;
  href: string;
  variant?: "default" | "ghost";
  className?: string;
}

const LinkButton = ({
  children,
  href,
  variant,
  className,
}: LinkButtonprops) => {
  return (
    <Button
      onClick={() => redirect(href)}
      className={`overflow-clip relative p-0 cursor-pointer transition-all duration-500 hover:bg-black hover:text-white border border-black hover:border-blue-400/30 ${className}`}
    >
      {variant === "ghost" ? (
        <div className="w-full h-full p-[0.5px] abolute flex items-center justify-center bg-linear-150 from-blue-500/30 from-10% via-white/0 via-40% to-blue-500/70 to-120%">
          <div className="w-full h-full flex items-center justify-center bg-black rounded-[7px] text-white hover:text-blue-500/70 px-6 transition-all duration-200">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full h-full px-6 abolute flex items-center justify-center bg-linear-150 from-blue-500/30 from-10% via-white/0 via-40% to-blue-500/70 to-120%">
          {children}
        </div>
      )}
    </Button>
  );
};

export default LinkButton;