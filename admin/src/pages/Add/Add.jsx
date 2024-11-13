import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import add from './add.mp4';


const Add = ({ url }) => {

  const [image, setImage] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false); // Add buttonClicked state here
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad', // default category 'Salad'
    isVeg: true, // default to Veg
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleVegStatus = (status) => {
    setData((prevData) => ({ ...prevData, isVeg: status }));
    setButtonClicked(true); // Mark as clicked
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('itemName', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('isVeg', data.isVeg);

    Array.from(image).forEach((item) => {
      formData.append('image', item);
    });

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const resid =  JSON.parse(localStorage.getItem('restaurantId'));
      const response = await axios.post(`${url}/${resid}/menu/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Salad',
          isVeg: true,
        });
        setImage([]);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while adding the food item.');
    }
  };

  return (
    <div className="body fade-in">
            <video autoPlay loop muted src={add} className="background-video">
        Your browser does not support the video tag.
      </video>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            {Array.from(image).map((item, index) => (
              <span key={index}>
                <img src={URL.createObjectURL(item)} alt="" />
              </span>
            ))}
          </label>
          <input onChange={(e) => setImage(e.target.files)} type="file" multiple />
        </div>

        {/* Product details */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here.."
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here.."
            required
          ></textarea>
        </div>

        {/* Category and price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select name="category" onChange={onChangeHandler} value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Biriyani">Biriyani</option>
              <option value="Burger">Burger</option>
              <option value="Momos">Momos</option>
              <option value="Pizza">Pizza</option>
              <option value="Juice">Juice</option>
              <option value="Rice">Rice</option>
              <option value="Nonveg Items">Nonveg Items</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="$10"
              required
            />
          </div>
        </div>

        {/* Veg/Non-Veg Toggle */}
        <div className="veg-toggle">
          <button
            type="button"
            className={` veg ,  ${data.isVeg ? 'active' : ''} ${buttonClicked && !data.isVeg ? 'blur' : ''}`}
            onClick={() => toggleVegStatus(true)}
          >
            Veg
          </button>
          <button
            type="button"
            className={` non-veg ,  ${!data.isVeg ? 'active' : ''} ${buttonClicked && data.isVeg ? 'blur' : ''}`}
            onClick={() => toggleVegStatus(false)}
          >
            Non-Veg
          </button>
        </div>

        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
