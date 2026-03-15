interface ShinyLogoProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ShinyLogo({
  src = "/logo.svg",
  alt = "IOMLogo",
  width = 400,
  height = 70,
  className = "",
}: ShinyLogoProps) {
  return (
    <>
      <style>{`
        .shiny-logo-wrapper {
          position: relative;
          width: fit-content;
          overflow: hidden;
        }

        .shiny-logo-wrapper::before {
          content: "";
          position: absolute;
          height: 200%;
          width: 200%;
          background: linear-gradient(
            180deg,
            transparent,
            transparent 20%,
            rgba(255, 255, 255, 0.35)
          );
          transform: rotate(-45deg) translateY(-10%);
          top: -100%;
          left: -130%;
          animation: shinyLogoSweep 5s ease infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes shinyLogoSweep {
          100% {
            transform: rotate(-60deg) translateY(650%);
          }
        }
      `}</style>

      <div className="nb-left">
        <div className={`shiny-logo-wrapper ${className}`}>
          <img
            className="iomLogo"
            src={src}
            alt={alt}
            width={width}
            loading="eager"
            height={height}
          />
        </div>
      </div>
    </>
  );
}
