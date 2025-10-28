import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Eye,
  Save,
  Zap,
  ArrowRight,
  Github,
  Twitter,
  Sparkles,
  Terminal,
  Layers,
} from "lucide-react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar";

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const flipperRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Flip animation for the inner flipper
   ScrollTrigger.matchMedia({
  "(min-width: 1400px)": () => {
    // large screens
    gsap.to(flipperRef.current, {
      rotationY: 180,
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 8%", // slower start
        end: "bottom 50%",
        scrub: 1,
        // markers: true,
      },
    });
  },
  "(max-width: 1399px)": () => {
    // default smaller screens
    gsap.to(flipperRef.current, {
      rotationY: 180,
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 8%",
        end: "bottom 65%",
        scrub: 1,
        // markers: true,
      },
    });
  },
});


    // Whole card elegant movement
    gsap.to(cardRef.current, {
      y: -60,
      rotateX: 5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 1%",
        end: "bottom 50%",
        scrub: 1,
        markers: false,
      },
    });

    // Features cards pop-up animation
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 75%",
          end: "bottom 40%",
          scrub: true,
          // markers: true,
        },
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-white font-sans overflow-hidden pt-16 ">
      <Navbar onEnter={() => navigate("/projects")} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex items-center m-auto px-6 py-20 lg:py-10 lg:w-11/12 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                  <span className="text-cyan-600 dark:text-cyan-400 font-medium text-sm uppercase tracking-wider">
                    Next-Gen IDE
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-semibold leading-tight tracking-tight text-left">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                    Code
                  </span>
                  <br />
                  <span className="text-gray-700 dark:text-gray-300">
                    in the Dark
                  </span>
                </h1>

                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                  Experience the future of web development with our sleek,
                  powerful browser IDE. Build React apps with unmatched speed
                  and elegance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/projects")}
                  className="group inline-flex px-8 py-4 bg-gray-500/90 dark:bg-transparent rounded-xl font-semibold text-lg shadow-[0_8px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_50px_-8px_rgba(0,0,0,0.15)] hover:scale-[1.03] transition-all duration-300 items-center justify-center gap-2 border border-gray-200 dark:border-cyan-500/20 backdrop-blur-sm cursor-pointer"
                >
                  <Terminal className="w-5 h-5 text-cyan-600 dark:text-inherit " />
                  Launch Studio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="inline-flex px-8 py-4 bg-gray-500/90 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-white dark:text-gray-300 rounded-xl hover:border-gray-300 hover:scale-[1.03] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_45px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 backdrop-blur-sm items-center justify-center cursor-pointer">
                  View Demos
                </button>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 md:mb-10 lg:mb-0">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/90 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/50 cursor-pointer hover:scale-[1.04] shadow-[0_6px_25px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_-10px_rgba(0,0,0,0.12)] dark:hover:shadow-white/25 transition-all duration-300">
                  <Zap className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Instant
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Hot Reload
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/90 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/50 cursor-pointer hover:scale-[1.04] shadow-[0_6px_25px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_-10px_rgba(0,0,0,0.12)] dark:hover:shadow-white/25 transition-all duration-300">
                  <Code className="w-5 h-5 text-green-500 dark:text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Monaco
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Editor
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/90 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/50 cursor-pointer hover:scale-[1.04] shadow-[0_6px_25px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_-10px_rgba(0,0,0,0.12)] dark:hover:shadow-white/25 transition-all duration-300">
                  <Layers className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Sandboxed
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Environment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <div ref={cardRef} className="relative mx-auto max-w-lg">
                <div
                  className="relative bg-white/95 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 rounded-3xl p-6 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-2xl overflow-hidden transition-all duration-500"
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      CipherStudio v2.0
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <div className="px-3 py-1 bg-cyan-50 text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-400 rounded text-sm border border-cyan-100 dark:border-cyan-500/20">
                      App.jsx
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 rounded text-sm">
                      styles.css
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 rounded text-sm">
                      index.js
                    </div>
                  </div>

                  {/* Flipper */}
                  <div
                    ref={flipperRef}
                    className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front - Code */}
                    <div
                      className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-gray-900 font-mono text-sm rounded-3xl overflow-auto p-5 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="text-cyan-600 dark:text-cyan-400">
                        import React, &#123; useState &#125; from 'react';
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mt-2">
                        function TodoApp() &#123;
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 ml-4">
                        const [todos, setTodos] = useState([]);
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mt-2 ml-4">
                        return (
                      </div>
                      <div className="ml-8">
                        <div className="text-blue-600 dark:text-blue-400">
                          <div className="app"></div>
                        </div>
                        <div className="text-green-600 dark:text-green-400 mt-1">
                          <h1>Todo App</h1>
                        </div>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 ml-4">
                        );
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        &#125;
                      </div>
                      <div className="text-cyan-600 dark:text-cyan-400 mt-2">
                        export default TodoApp;
                      </div>
                    </div>

                    {/* Back - Preview */}
                    <div
                      className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-gray-900 rounded-3xl overflow-hidden p-6 flex flex-col justify-center items-center"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="text-gray-700 dark:text-gray-400 text-sm mb-4 font-mono tracking-wide">
                        Live Preview
                      </div>

                      <div className="w-full max-w-xs h-28 md:h-32 lg:h-36 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700/30 shadow-[0_6px_30px_-10px_rgba(0,0,0,0.08)]">
                        <div className="text-center">
                          <div className="text-gray-900 dark:text-white font-semibold text-lg">
                            Hello World
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            Rendered instantly
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative flex items-center m-auto px-6 py-20 lg:py-32 lg:w-11/12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900/70 dark:text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need to build amazing React applications in your
              browser
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-1">
            {[
              {
                icon: <Code className="w-6 h-6 text-black dark:text-white" />,
                title: "Advanced Editor",
                desc: "Monaco-powered editor with syntax highlighting, intelligent autocompletion, and real-time linting.",
              },
              {
                icon: <Eye className="w-6 h-6 text-black dark:text-white" />,
                title: "Live Preview",
                desc: "See your changes instantly with hot module replacement and integrated console.",
              },
              {
                icon: <Save className="w-6 h-6 text-black dark:text-white" />,
                title: "Cloud Storage",
                desc: "Save your projects securely in the cloud and access them anywhere.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="feature-card group dark:bg-gray-800/30 bg-gray-300/70 border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <div className="w-14 h-14 flex items-center justify-center mb-6 rounded-xl bg-gray-700/40 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-600 transition-colors duration-300 dark:group-hover:text-white group-hover:text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative flex items-center justify-center px-6 py-12 lg:py-6 dark:bg-black bg-gray-300">
        <div className="max-w-3xl w-full text-center space-y-6">
          {/* Header */}
          <h2 className="text-4xl lg:text-5xl font-extrabold dark:text-white text-black/60 leading-tight tracking-tight">
            Ready to Build Something Amazing?
          </h2>

          {/* Subtitle */}
          <p className="dark:text-gray-400 text-black/40 text-lg lg:text-xl leading-relaxed">
            Join thousands of developers shaping the future of web development
            with our sleek, powerful browser IDE.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/projects")}
            className="relative inline-flex items-center justify-center px-12 py-4 bg-transparent text-white font-semibold text-lg rounded-2xl border border-white/50 hover:cursor-pointer hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,255,255,0.3)] transition-all duration-300 group overflow-hidden"
          >
            {/* Subtle glow effect */}
            <span className="absolute inset-0 dark:bg-transparent border border-black  bg-gray-400  transition-all duration-300 rounded-2xl"></span>
            <span className="relative z-10 dark:text-white text-black/50">Launch CipherStudio</span>
          </button>

          {/* Optional subtle hint text */}
          <p className="dark:text-gray-500 text-gray-700 text-sm mt-2">
            No credit card required • Start instantly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className=" dark:bg-black bg-gray-300 dark:text-gray-400 text-gray-800 px-8 py-16  lg:py-24 lg:w-11/12 mx-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Section */}
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo1.png" alt="" className="h-14" />
              </div>
              <p className="dark:text-gray-400 text-gray-700 text-sm">
                The future of browser-based development. Elegant, fast, and
                minimal.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold dark:text-white text-gray-700 mb-4 tracking-wide">
                Product
              </h4>
              <ul className="space-y-2 dark:text-gray-400 text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold dark:text-white text-gray-700 mb-4 tracking-wide">
                Company
              </h4>
              <ul className="space-y-2 dark:text-gray-400 text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold dark:text-white mb-4 tracking-wide text-gray-700">
                Connect
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 rounded-full dark:bg-gray-900  hover:bg-gray-800 transition-colors duration-200"
                >
                  <Github className="w-5 h-5 dark:text-white text-black hover:text-white transition-colors duration-200" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full dark:bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5 dark:text-white text-black hover:text-white transition-colors duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800/50 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CipherStudio. Crafted with ❤️ for
            developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
