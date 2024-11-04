import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useGetMenuByRestaurantIdQuery } from "../../slices/menuApiSlice";

const MenuList = ({ isOpen, onClose, restaurantId }) => {
  const {
    data,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuByRestaurantIdQuery(restaurantId);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchMenuItems = () => {
      try {
        if (data && data.data) {
          setMenuItems(data.data);
          setFilteredItems(data.data);

          const uniqueCategories = [
            ...new Set(data.data.map((item) => item.category)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    if (isOpen && data) {
      fetchMenuItems();
    }
  }, [isOpen, data]);

  useEffect(() => {
    const filtered = menuItems.filter(
      (item) =>
        (selectedCategory === "" || item.category === selectedCategory) &&
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, menuItems]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="menu-dialog-title"
      className={`${darkMode ? "dark" : ""}`}
      PaperProps={{
        style: {
          backgroundColor: darkMode ? "#1a202c" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          maxWidth: "800px",
          width: "100%",
          margin: "16px",
          borderRadius: "16px",
          padding: "16px",
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle
        id="menu-dialog-title"
        className="flex justify-between items-center p-4"
      >
        <Typography variant="h5" component="div" className="font-bold">
          Menu
        </Typography>
        <div className="flex items-center space-x-2">
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className="flex flex-col space-y-6 p-4">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow"
            InputProps={{
              startAdornment: (
                <SearchIcon
                  className="mr-2"
                  style={{ color: darkMode ? "#ffffff" : "#000000" }}
                />
              ),
            }}
            inputProps={{
              style: {
                color: darkMode ? "#ffffff" : "#000000", // Ensure input text is visible
                caretColor: darkMode ? "#ffffff" : "#000000", // Matches caret color with text
              },
            }}
            InputLabelProps={{
              style: {
                color: darkMode ? "#ffffff" : "#000000", // Set label color for both modes
              },
            }}
          />

          <FormControl variant="outlined" className="min-w-[120px]">
            <InputLabel
              id="category-select-label"
              style={{ color: darkMode ? "#ffffff" : "#000000" }}
            >
              Category
            </InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
              style={{ color: darkMode ? "#ffffff" : "#000000" }}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[60vh] pr-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: darkMode ? "#4a5568 #2d3748" : "#cbd5e0 #edf2f7",
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white mb-2 cursor-pointer dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="grid grid-cols-[2fr_1fr_1fr] sm:grid-cols-1">
                <img
                  src={item.image[0].url}
                  alt={item.itemName}
                  className="w-full h-48 bject-cover col-span-1 sm:col-span-full"
                />
                <div className="p-4 col-span-2 sm:col-span-full">
                  <Typography
                    variant="text-base"
                    className="font-semibold mb-2 text-black dark:text-white"
                  >
                    {item.itemName}
                  </Typography>
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-black dark:text-white"
                    >
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={item.isVeg ? "text-green-600" : "text-red-600"}
                    >
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuList;
