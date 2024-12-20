import React, { createContext, useState, useContext, ReactNode } from "react";

interface AddressContextType {
  address: string | undefined;
  setAddress: (address: string | undefined) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};