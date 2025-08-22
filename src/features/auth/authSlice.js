import { createSlice } from '@reduxjs/toolkit';

// On essaie de récupérer les infos utilisateur du localStorage au cas où la page a été rafraîchie
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

const initialState = {
  userInfo: userInfo ? userInfo : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action pour définir les identifiants lors de la connexion
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      // On sauvegarde aussi les infos dans le localStorage du navigateur
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Action pour effacer les identifiants lors de la déconnexion
    logOut: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;