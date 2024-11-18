import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [greeting, setGreeting] = useState("");

  const slides = [
    "images.unsplash.com/photo-1497215728101-856f4ea42174",
    "images.unsplash.com/photo-1497366216548-37526070297c",
    "images.unsplash.com/photo-1497366811353-6870744d04b2",
  ];

  const developers = [
    {
      name: "Sukharanjan Jana",
      status: "Developer",
      image: `${assets.dev2}`,
      github: "https://github.com/Sukh767",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Tarun Kumar",
      status: "Developer",
      image: `${assets.dev1}`,
      github: "https://github.com/SoumyaT007",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Soumya pramanik",
      status: "Developer",
      image: `${assets.dev3}`,
      github: "https://github.com/tarunlkr6",
      linkedin: "#",
      twitter: "#",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen overflow-y-scroll">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={assets.logo}
              alt="Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-cover"
            />
            <span className="text-lg md:text-xl font-bold text-gray-800">
              Scan&Dine
            </span>
          </div>
          <Link to="/login">
            <button className="px-4 py-2 md:px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Sections Wrapper */}
      <div className="pt-16">
        {/* Hero Section */}
        <section
          className="h-screen relative bg-cover bg-fixed"
          style={{
            backgroundImage: `url(https://${slides[currentSlide]})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
              {greeting}!
            </h1>
            <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold mb-4">
              Admin Panel
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
              <Link to="/register">
                <button className="px-6 py-3 md:px-8 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300">
                  Create Restaurant
                </button>
              </Link>
              <Link to="/login">
                <button className="px-6 py-3 md:px-8 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section
          className="h-screen relative bg-cover bg-fixed bg-gray-100 py-16 md:py-24"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d)`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 z-40">
            <div className="container mx-auto px-4 md:px-8 mt-40">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white">
                Our Development Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers.map((dev, index) => (
                  <div
                    key={index}
                    className="relative w-full group hover:scale-105 transition-transform duration-300"
                    style={{
                      clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                    }}
                  >
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent text-white p-4 flex flex-col justify-end rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 p-4">
                        {dev.name}
                      </h3>
                      <p className="text-sm mb-4 p-2">{dev.status}</p>
                      <div className="flex space-x-4">
                        <a
                          href={dev.github}
                          className="hover:text-blue-700 transition-colors duration-300"
                          aria-label="Github"
                        >
                          <i className="fa-brands fa-github fa-lg"></i>
                        </a>
                        <a
                          href={dev.linkedin}
                          className="hover:text-blue-700 transition-colors duration-300"
                          aria-label="LinkedIn"
                        >
                          <i className="fa-brands fa-linkedin fa-lg"></i>
                        </a>
                        <a
                          href={dev.twitter}
                          className="hover:text-blue-700 transition-colors duration-300"
                          aria-label="Twitter"
                        >
                          <i className="fa-brands fa-twitter fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer
          className="h-screen relative bg-cover bg-fixed"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1519681393784-d120267933ba)`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4 text-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex justify-center mb-4">
                <img
                  src={assets.logo}
                  alt="Scan&Dine Logo"
                  className="h-56 w-56 object-contain" // Tailwind utility for fixed size and proper scaling
                />
              </div>
              <p className="mt-4 text-sm">
                Made with love by the Development Team.
              </p>
              <p className="mt-4 text-sm">Scan&Dine</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
