import { createContext ,useEffect,useState} from "react";
import { food_list, menu_list, offer_list } from "../assets/assets";


export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const url = 'http://localhost:8080';

    const [token, setToken] = useState('') //To save the token

    const addToCart = (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev) => ({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev) =>({...prev,[itemId]:prev[itemId]-1}))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for(const item in cartItems)
        {   
            if (cartItems[item] > 0) {
            let itemInfo = food_list.find((product)=>product._id === item);
            totalAmount += itemInfo.price * cartItems[item];
            }
            
        }
        return totalAmount;
    }
    
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("Token") || "";
        setToken(tokenFromStorage);
      }, [setToken]); // Dependency on setToken ensures the effect runs when setToken changes

    const contextValue = {
        food_list,
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