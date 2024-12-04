import { createContext ,useEffect,useState} from "react";
import { menu_list, offer_list } from "../assets/assets";
import axios from 'axios'


export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const url = 'http://localhost:8080'
//const url = ''

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