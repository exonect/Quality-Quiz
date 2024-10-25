import React, { createContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const location = useLocation();
  const [apiStore, setApiStore] = useState({});
  const [isAppLoading, setIsAppLoading] = useState(true);
  const navigate = useNavigate();
  
  const value = {
    apiStore,
    isAppLoading,
    setIsAppLoading
  };

  return (
    <AppContext.Provider value={value}>
      <div className="bg-[#e2e8f0]">
        {children}
      </div>
    </AppContext.Provider>
  );
};
export default AppContextProvider;
