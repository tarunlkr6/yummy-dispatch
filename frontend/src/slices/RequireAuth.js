import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurentToken } from "./slices/authSlice";


const RequireAuth = ()=> {
    const token = useSelector(selectCurentToken)
    const location = useLocation();



    return (
        token ? <Outlet/> : <Navigate to='/login' state={{ form: location}} replace />
    )
}


export default RequireAuth