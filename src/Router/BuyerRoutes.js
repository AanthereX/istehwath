import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import SpinnerComponent from "../Components/Spinner/spinnerComponent";
import { BUYER_ROUTES } from "./routes.constants";

export default function BuyerRoutes() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute role={"buyer"} />}>
          {BUYER_ROUTES &&
            BUYER_ROUTES?.map((item) => (
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
}
