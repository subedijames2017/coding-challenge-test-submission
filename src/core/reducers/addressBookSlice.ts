import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Slice state
interface AddressBookState {
  addresses: Address[];
}

const initialState: AddressBookState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "addressBook",
  initialState,
  reducers: {
    // Upsert-safe add: replace if same id exists, else push
    addAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        // Replace at the same position
        state.addresses[index] = action.payload;
      } else {
        // Add new if not found
        state.addresses.push(action.payload);
      }
    },
    // Remove by id (payload is the id string)
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(a => a.id !== action.payload);
    },

    // Replace whole list
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// Selectors
export const selectAddress = (state: RootState) => state.addressBook.addresses;
export const selectAddressById =
  (id: string) => (state: RootState) =>
    state.addressBook.addresses.find(a => a.id === id);

export default addressBookSlice.reducer;
