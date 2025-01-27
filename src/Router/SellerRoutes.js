import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { SELLER_ROUTES } from "./routes.constants";
import PrivateRoute from "./PrivateRoutes";
import SpinnerComponent from "../Components/Spinner/spinnerComponent";

const SellerRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute role={"seller"} />}>
          {SELLER_ROUTES &&
            SELLER_ROUTES?.map((item) => (
              <Route
                key={item?.id}
                path={item?.path}
                element={
                  <Suspense fallback={<SpinnerComponent />}>
                    <item.component />
                  </Suspense>
                }
              >
                {item?.nestedPaths?.length &&
                  item?.nestedPaths?.map((subItem) => (
                    <Route
                      key={subItem?.id}
                      path={subItem?.path}
                      element={
                        <Suspense>
                          <subItem.component />
                        </Suspense>
                      }
                    />
                  ))}
              </Route>
            ))}
        </Route>
      </Routes>
    </>
  );
};

export default SellerRoutes;
