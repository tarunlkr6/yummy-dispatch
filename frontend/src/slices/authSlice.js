import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     accessToken: localStorage.getItem('accessToken') || null,
//     userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
// };

const authSlice = createSlice({
    name: 'auth',
    initialState: { userInfo: null, accessToken: null },
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload.data.user;
            state.accessToken = action.payload.data.accessToken;
        },
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;


//export const { setCredentials, logout, restoreAuth } = authSlice.actions;
// export default authSlice.reducer;
