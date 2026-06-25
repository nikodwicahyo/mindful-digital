interface SectionDividerProps {
  variant?: "wave" | "curve" | "angle";
}

export default function SectionDivider({ variant = "wave" }: SectionDividerProps) {
  if (variant === "curve") {
    return (
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120V60C240 0 480 40 720 60C960 80 1200 20 1440 60V120H0Z"
            className="fill-cream"
          />
        </svg>
      </div>
    );
  }

  if (variant === "angle") {
    return (
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path d="M0 0L1440 80V0H0Z" className="fill-ink" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative -mt-1">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120C240 40 480 80 720 100C960 120 1200 60 1440 80V120H0Z"
          className="fill-ink"
        />
      </svg>
    </div>
  );
}
