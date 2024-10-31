import React, { useState } from "react";
import { Link } from "react-router-dom";

function Card(props) {

  const [seeMenu, setSeeMenu] = useState(false);
  const showMenu = () =>{
    setSeeMenu(true);
    console.log('Menu shown');
  }

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 shrink-0 grow">
      <Link to="#" aria-label="Restaurant Image Link">
        <img className="rounded-t-lg w-full" src={props.image} alt="Restaurant" />
      </Link>
      <div className="p-5">
        <Link to="#" aria-label="Restaurant Name Link">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {props.name} {/* Use props.name to dynamically show the restaurant name */}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-4">
          {props.description}
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
        >
          Read more &rarr;
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              d="M7 1l5 4H2l5-4zm0 8l-5-4h10l-5 4z" // Example path data for an arrow
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </Link>
        <button onClick={showMenu} className="ml-7 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black">Menu</button>
      </div>
    </div>
  );
}

export default Card;
