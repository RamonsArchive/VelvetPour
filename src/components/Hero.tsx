import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Store references for cleanup
    const scrollTriggers = [];

    // Leaf animations - combine into one timeline to avoid conflicts
    const leafTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    leafTl.to(
      ".left-leaf",
      {
        y: -200,
        ease: "power2.out",
      },
      0
    );

    leafTl.to(
      ".right-leaf",
      {
        y: 200,
        ease: "power2.out",
      },
      0
    );

    // Text animations
    const heroSplit = new SplitText(".title", { type: "chars, words" });
    const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1,
    });

    // Video scroll timeline - fixed targeting and loading
    const setupVideoAnimation = () => {
      if (!videoRef.current) return;

      const startValue = isMobile ? "top 50%" : "center 60%";
      const endValue = isMobile ? "120% top" : "bottom top";

      const videoTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoRef.current, // Use the actual video element
          start: startValue,
          end: endValue,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            // More reliable way to control video playback
            if (videoRef.current && videoRef.current.duration) {
              const progress = self.progress;
              videoRef.current.currentTime =
                progress * videoRef.current.duration;
            }
          },
        },
      });

      scrollTriggers.push(videoTl.scrollTrigger);
    };

    // Wait for video to load before setting up animation
    if (videoRef.current) {
      if (videoRef.current.readyState >= 1) {
        // Video metadata already loaded
        setupVideoAnimation();
      } else {
        // Wait for metadata to load
        videoRef.current.addEventListener(
          "loadedmetadata",
          setupVideoAnimation,
          { once: true }
        );
      }
    }

    // Cleanup function
    return () => {
      // Clean up SplitText instances
      heroSplit?.revert();
      paragraphSplit?.revert();

      // Kill all ScrollTriggers created in this component
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.trigger === heroRef.current ||
          trigger.trigger === videoRef.current ||
          trigger.trigger?.closest("#hero")
        ) {
          trigger.kill();
        }
      });
    };
  }, [isMobile]); // Add isMobile as dependency

  return (
    <>
      <section id="hero" ref={heroRef} className="noisy">
        <h1 className="title">MOJITO</h1>
        <img
          src="/images/hero-left-leaf.png"
          alt="left-leaf"
          className="left-leaf"
        />
        <img
          src="/images/hero-right-leaf.png"
          alt="right-leaf"
          className="right-leaf"
        />
        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p>Cool. Crisp. Classic.</p>
              <p className="subtitle">
                Sip the Spirit <br /> of Summer
              </p>
            </div>
            <div className="view-cocktails">
              <p className="subtitle">
                Every cocktail on our menu is a blend of premium ingredients,
                creative flair, and timeless recipes - designed to delight your
                senses.
              </p>
              <a href="cocktails">View Cocktails</a>
            </div>
          </div>
        </div>
      </section>
      <div className="video absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          muted
          src="/videos/output.mp4"
          playsInline
          preload="auto"
        />
      </div>
    </>
  );
};

export default Hero;
