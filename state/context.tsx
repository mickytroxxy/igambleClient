import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateData, uploadFile } from '../helpers/api';
import { showToast } from '../helpers/methods';
import { setAccountInfo } from './slices/accountInfo';
import { UserProfile } from '../constants/Types';
import useUsers from '../hooks/useUsers';
import { RootState } from './store';
import useGames from '../hooks/useGames';

export const AppContext = React.createContext<any>(null);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const {bettingAmount,mainBalance,gamblingItems,gameTypes,gameStarted} = useSelector((state: RootState) => state.game);
    const {flipCard,isGameOver,getGamblingItems} = useGames();
    const appState: any = {bettingAmount,getGamblingItems,mainBalance,gamblingItems,flipCard,gameTypes,gameStarted,isGameOver};

    return (
        <AppContext.Provider value={{ appState }}>
        {children}
        </AppContext.Provider>
    );
};
