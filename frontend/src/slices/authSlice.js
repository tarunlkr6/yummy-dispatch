import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     accessToken: localStorage.getItem('accessToken') || null,
//     userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
// };

const authSlice = createSlice({
    name: 'auth',
    initialState:{userInfo: null, accessToken: null},
    reducers: {
        setCredentials: (state, action) => {
            console.log('auth slice: ',action.payload);
            state.userInfo = action.payload.data.user;
            state.accessToken = action.payload.data.accessToken;
            //localStorage.setItem('userInfo', JSON.stringify(action.payload.data.user));
            //localStorage.setItem('accessToken', action.payload.data.accessToken);
        },
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            //localStorage.removeItem('userInfo');
            //localStorage.removeItem('accessToken');
        },
        restoreAuth: (state, action) => {
            state.userInfo = action.payload.userInfo || null;
            state.accessToken = action.payload.accessToken || null;
        },
    },
});

export const { setCredentials, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
