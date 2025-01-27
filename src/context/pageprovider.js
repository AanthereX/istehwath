/** @format */

import { createContext, useContext, useState } from "react";

const PageContext = createContext();
export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }) => {
  const [pageSellerLogs, setPageSellerLogs] = useState(1);
  const [pageBuyerLogs, setPageBuyerLogs] = useState(1);
  const [tab, setTab] = useState("All");
  const [status, setStatus] = useState("all");

  return (
    <PageContext.Provider
      value={{
        pageSellerLogs,
        setPageSellerLogs,
        pageBuyerLogs,
        setPageBuyerLogs,
        tab,
        setTab,
        status,
        setStatus,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
