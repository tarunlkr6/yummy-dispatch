import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";

function RestaurantCard({
  _id,
  name,
  description,
  avatar,
  isOpen,
  openingTime,
  closingTime,
}) {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(false);

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
      // Extract the restaurant ID from the scanned URL
      const scannedId = result.split("/restaurant/")[1]?.split("/")[0];

      if (scannedId === _id) {
        // IDs match; navigate to the result
        scanner.clear();
        setIsScannerActive(false);
        navigate(result);
      } else {
        // IDs do not match; show error
        toast.error("Scanned QR code does not match this restaurant.");
        scanner.clear();
        setIsScannerActive(false);
      }
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
  }, [isScannerActive, navigate, _id]);

  const openScanner = () => {
    setIsScannerActive(true);
  };

  const onClickHandler = (id, event) => {
    event.stopPropagation();
    if (id) {
      navigate(`/restaurant/${id}/view`);
    }
  };

  return (
    <>
      {/* Scanner Modal - only visible when active */}
      {isScannerActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-200 w-80 p-8 rounded-lg shadow-lg relative">
            <button
              onClick={(event) => {
                event.stopPropagation(), setIsScannerActive(false);
              }}
              className="absolute top-1 right-1 text-gray-700 hover:text-gray-900 font-bold"
            >
              <box-icon name="x-square" type="solid" color="black"></box-icon>
            </button>
            <div id="qr-reader" className="w-full h-full"></div>
          </div>
        </div>
      )}

      {/* Restaurant Card */}

      <Card
        onClick={(event) =>{event.stopPropagation(), onClickHandler(_id, event)}}
        className={`w-full max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden transition-all duration-300 `}
        role="button"
        
      >
        <CardHeader floated={false} className="h-48 m-0 rounded-none">
          <img
            src={avatar}
            alt={name}
            className={`w-full h-full object-cover object-center transition-transform duration-300 ${
              isOpen ? "hover:scale-105" : "grayscale"
            }`}
          />
        </CardHeader>
        <CardBody className="flex-1 flex flex-col p-4">
          <div className="flex justify-between items-center">
            <Typography
              variant="h4"
              color="blue-gray"
              className={`font-semibold ${!isOpen && "text-gray-700"}`}
            >
              {name}
            </Typography>
            <div className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full mr-2 ${
                  isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <Typography
                color={isOpen ? "green" : "red"}
                className="text-sm font-medium"
              >
                {isOpen ? "Open" : "Closed"}
              </Typography>
            </div>
          </div>

          <Typography color="gray" className="mb-2 text-sm">
            Hours:{" "}
            <span className="font-medium">
              {openingTime} - {closingTime}
            </span>
          </Typography>
          <Typography
            color="gray"
            className="text-sm line-clamp-3 overflow-hidden flex-grow"
          >
            {description}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between p-4">
          <div className="w-full">
            {scanResult ? (
              <div>Success: Redirecting...</div>
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  if (isOpen) {
                    event.stopPropagation();
                    openScanner();
                  }
                }}
                disabled={!isOpen}
                className={`w-full h-full text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 transition-colors duration-300 ${
                  isOpen
                    ? "bg-gray-800 hover:bg-gray-900"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                <box-icon
                  name="qr-scan"
                  animation="flashing"
                  color="white"
                ></box-icon>
              </button>
            )}
          </div>
          <Link to={`/${_id}/book-table`} className="w-full ml-2">
            <Button
              fullWidth
              onClick={(event) => {
               event.stopPropagation()
               //event.preventDefault(); // Prevent navigation if closed
              }}
              className={`w-full h-full font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-300 ${
                isOpen
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-700"
              }`}
            >
              Book Table
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

export default RestaurantCard;
