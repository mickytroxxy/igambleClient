import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    isVisible: false,
    attr: { headerText: 'HEADER TEXT' },
}
export const modalState = createSlice({
    name: 'modalState',
    initialState,
    reducers: {
        setModalState: (state,action) => {
            return {...state,...action.payload};
        },
    }
})
export const { setModalState } = modalState.actions
export default modalState.reducer