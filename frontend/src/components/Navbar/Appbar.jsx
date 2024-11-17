import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import FastfoodTwoToneIcon from '@mui/icons-material/FastfoodTwoTone';

import { assets } from "../../assets/assets";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { Html5QrcodeScanner } from "html5-qrcode";


function ProfileMenu({ handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const navigate = useNavigate();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="Profile"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        <Link to='/user/me'>
        <MenuItem className="flex items-center gap-2 rounded">
          <UserCircleIcon className="h-4 w-4" />
          <Typography as="span" variant="small" className="font-normal">
            My Profile
          </Typography>
        </MenuItem>
        </Link>
        <MenuItem className="flex items-center gap-2 rounded">
          <Cog6ToothIcon className="h-4 w-4" />
          <Link to='/user/change-password'>
            <Typography as="span" variant="small" className="font-normal">
              Change password
            </Typography>
          </Link>
        </MenuItem>
        <Link to='/table/details'>
        <MenuItem className="flex items-center gap-2 rounded">
          <InboxArrowDownIcon className="h-4 w-4" />
          <Typography as="span" variant="small" className="font-normal">
            Inbox
          </Typography>
        </MenuItem>
        </Link>
        <Link to='/vieworders'>
          <MenuItem className="flex items-center gap-2 rounded">
            <FastfoodTwoToneIcon sx={{fontSize:18}} />
            <Typography as="span" variant="small" className="font-normal">
              Orders
            </Typography>
          </MenuItem>
        </Link>
        <hr className="my-2 border-blue-gray-50" />
        <MenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 rounded hover:bg-red-500/10"
        >
          <PowerIcon className="h-4 w-4 text-red-500" />
          <Typography
            as="span"
            variant="small"
            className="font-normal "
            color="red"
          >
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function Appbar({ setShowLogin }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Navigate to the home page with the search keyword as a parameter
    navigate(`/?keyword=${value}`);
  };

  useEffect(() => {
    let scanner;

    if (isScannerActive) {
      scanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      });

      scanner.render(onScanSuccess, onScanError);
    }

    function onScanSuccess(result) {
      scanner.clear();
      setIsScannerActive(false); // Close the modal after a successful scan
      navigate(result); // Redirect to the scanned URL
    }

    function onScanError(error) {
      console.warn("QR Scan Error:", error);
    }

    return () => {
      if (scanner) {
        scanner
          .clear()
          .catch((error) => console.warn("Clear scanner error:", error));
      }
    };
  }, [isScannerActive, navigate]);

  return (
    <div className="w-full">
      <Navbar className="w-full p-1 rounded-none shadow-none max-w-none">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/">
            <Typography as="div" variant="h5">
              <img src={assets.app} alt="Scan&Dine" className="h-15 md:h-[190px] hover:scale-110" />
            </Typography>
          </Link>

          {/* Search bar (desktop view) */}
          <div className="hidden md:flex flex-grow justify-center mx-8 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="search"
                color="red"
                value={searchTerm}
                onChange={handleSearch}
                label="Search for a restaurant..."
                className="pr-20 py-4"
                containerProps={{
                  className: "min-w-[288px]",
                }}
              />
              {/* <Button
                size="sm"
                className="!absolute right-1 top-1 rounded bg-[#ff6347]"
              >
                Search
              </Button> */}
            </div>
          </div>

          {/* Icons for both mobile and desktop views */}
          <div className="flex items-center gap-6">
            <IconButton
              size="sm"
              color="blue-gray"
              variant="text"
              className="md:hidden"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-7 w-7" />
            </IconButton>
            <IconButton
              size="sm"
              color="blue-gray"
              variant="text"
              onClick={() => {
                setIsScannerActive(true);
              }}
            >
              <box-icon name='qr-scan' color='#6d6d6d' ></box-icon>
            </IconButton>
            <Link to="/cart">
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
              >
                <box-icon name='shopping-bag' type='solid' flip='horizontal' color='#5a5a5a' ></box-icon>
              </IconButton>
            </Link>
            {!userInfo ? (
              <Button
                size="sm"
                onClick={() => setShowLogin(true)}
                className="w-full bg-[#ff6347] rounded-full hover:bg-red-600 hover:shadow-red-400 p-2"
              >
                Sign In
              </Button>
            ) : (
              <ProfileMenu handleLogout={handleLogout} />
            )}
          </div>
        </div>

        {/* QR Scanner Modal */}
        {isScannerActive && (
          <div className="relative mt-50 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-200 w-80 p-8 rounded-lg shadow-lg relative">
              <button
                onClick={() => setIsScannerActive(false)}
                className="absolute top-1 right-1 text-gray-700 hover:text-gray-900 font-bold"
              >
                <box-icon name="x-square" type="solid" color="black"></box-icon>
              </button>
              <div id="qr-reader" className="w-full h-full"></div>
            </div>
          </div>
        )}
        
        {/* Responsive search bar for mobile */}
        {isSearchVisible && (
          <div className="mt-2 md:hidden px-4">
            <div className="relative">
              <Input
                type="search"
                color="red"
                value={searchTerm}
                onChange={handleSearch}
                label="Search for a restaurant..."
                containerProps={{
                  className: "min-w-full",
                }}
              />
              {/* <Button
                size="sm"
                variant="outlined"
                color="black"
                className="!absolute right-1 top-1 rounded text-red-500"
              >
                Search
              </Button> */}
            </div>
          </div>
        )}
      </Navbar>
    </div>
  );
}

export default Appbar;
