import {
  addAddress as addAddressAction,
  removeAddress as removeAddressAction,
  selectAddress,
  updateAddresses,
} from "../core/reducers/addressBookSlice";
import { Address } from "@/types";
import React from "react";
import { useAppDispatch, useAppSelector } from "../core/store/hooks";

import transformAddress, { RawAddressModel } from "../core/models/address";
import databaseService from "../core/services/databaseService";

export default function useAddressBook() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddress);
  const [loading, setLoading] = React.useState(true);

  // Persist on state change (prevents stale writes)
  React.useEffect(() => {
    (async () => {
      try {
        await databaseService.setItem("addresses", addresses);
      } catch (e) {
        // optional: surface an error toast/log
        // console.error("Failed to persist addresses", e);
      }
    })();
  }, [addresses]);

  const addAddress = React.useCallback((address: Address) => {
    console.log("🚀 ~ useAddressBook ~ address:", address)
    dispatch(addAddressAction(address));
  }, [dispatch]);

  const removeAddress = React.useCallback((id: string) => {
    dispatch(removeAddressAction(id));
  }, [dispatch]);

  const loadSavedAddresses = React.useCallback(async () => {
    try {
      const saved: RawAddressModel[] | null = await databaseService.getItem("addresses");
      if (Array.isArray(saved)) {
        dispatch(updateAddresses(saved.map(transformAddress)));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    addAddress,
    removeAddress,
    loadSavedAddresses,
    loading,
  };
}
