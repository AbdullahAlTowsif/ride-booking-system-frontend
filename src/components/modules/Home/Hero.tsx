import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Logo from "@/assets/icons/Logo";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <Logo></Logo>
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Reliable Rides, Anytime,{" "}
                <span className="text-primary">Anywhere</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Book rides instantly with our fast, user-friendly platform.
                Track your driver in real time and enjoy secure, cashless
                payments. Your smooth, reliable journey starts with just one
                tap.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/login">
              <Button className="shadow-sm transition-shadow hover:shadow">
                Get Started
              </Button></Link>
              <Link to="/about">
                <Button variant="outline" className="group">
                Learn more{" "}
                <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-col items-center gap-5">
              <p className="font-medium text-muted-foreground lg:text-left">
                Your Trusted Ride Booking Platform
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  🚖
                </span>
                <span
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  🚘
                </span>

                <span
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}
                >
                  🏍️
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
