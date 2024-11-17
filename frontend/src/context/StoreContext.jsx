import { createContext ,useEffect,useState} from "react";
import { menu_list, offer_list } from "../assets/assets";
import axios from 'axios'


export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const url = process.env.BACKEND_LOCAL_URL
//const url = 'https://scan-dine-backend-bnj2.onrender.com'

    const contextValue = {
        menu_list,
        cartItems,
        offer_list,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    }

    return(
     <StoreContext.Provider value={contextValue}>
        {props.children}
     </StoreContext.Provider>       
    )
}

export default StoreContextProvider;