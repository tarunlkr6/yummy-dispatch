import React from "react";
import image1 from "../../assets/images-1.jpg"; // Adjust the path as needed
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden relative before:block before:absolute before:bg-black before:h-full before:w-full before:top-0 before:left-0 before:z-10 before:opacity-30">
        <img
          src="https://picsum.photos/seed/picsum/1900/850"
          className="absolute top-0 left-0 min-h-full object-cover"
          alt=""
        />
        <div className="relative z-20 max-w-screen-lg mx-auto grid grid-cols-12 h-full items-center">
          <div className="col-span-6">
            <span className="uppercase text-white text-xs font-bold mb-2 block">
              WE TO ADMIN PORTAL ----
            </span>
            <h1 className="text-white font-extrabold text-5xl mb-8">
              Scan & Dine
            </h1>
            <p className="text-stone-100 text-base">
              Welcome to your restaurant management system!
            </p>
            <Link to="/register">
              <button className="mt-8 text-white uppercase py-4 text-base font-light px-10 border border-white hover:bg-white hover:bg-opacity-10">
                REGISTER
              </button>
            </Link>
            <Link to="/login">
              <button className="mt-8 text-white uppercase ml-3 py-4 text-base font-light px-10 border border-white hover:bg-white hover:bg-opacity-10">
                LOGIN
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#f7d0b6] py-20">
        <div className="max-w-screen-lg mx-auto flex justify-between items-center">
          <div className="max-w-xl">
            <h2 className="font-black text-sky-950 text-3xl mb-4">
              As the leading experts in this field, we're in over 90 countries
            </h2>
            <p className="text-base text-sky-950">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <button className="text-sky-950 uppercase py-3 text-base px-10 border border-sky-950 hover:bg-sky-950 hover:bg-opacity-10">
            Get started
          </button>
        </div>
      </div>

      <div className="py-12 relative overflow-hidden bg-white">
        <div className="grid grid-cols-2 max-w-screen-lg mx-auto">
          <div className="w-full flex flex-col items-end pr-16">
            <h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10">
              Whether you need Assistance
            </h2>
            <div className="h-full mt-auto overflow-hidden relative">
              <img
                src="https://picsum.photos/seed/picsum/1900/850"
                className="h-full w-full object-contain"
                alt=""
              />
            </div>
          </div>

          <div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0">
            <div className="relative z-20 pl-12">
              <h2 className="text-[#f7d0b6] font-black text-5xl leading-snug mb-10">
                Finpoint is here <br />
                to help you
              </h2>
              <p className="text-white text-sm">
                Purus in massa tempor nec. Magna etiam tempor orci eu lobortis
                elementum nibh tellus molestie. Faucibus ornare suspendisse sed
                nisi lacus sed viverra. Diam in arcu cursus euismod quis viverra
                nibh cras pulvinar.
              </p>
              <button className="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10">
                Talk with expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Repeat sections can be added here as needed */}
    </>
  );
};

export default Home;
