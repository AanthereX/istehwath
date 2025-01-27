import { lazy } from "react";

const SCREENS = {
  // Seller Routes Contstants
  sellerSetting: "/seller/setting",
  sellerEditProfile: "/seller/edit-profile",
  sellerListing: "/seller/listing",
  promoteSellerStartup: "/seller/promote/:id",
  promoteBuyerStartup: "/buyer/promote/:id",
  sellerStartupDetail: "/seller/startup-detail/:id",
  sellerHireExpert: "/seller/hire-expert",
  sellerHireForm: "/seller/hire-form/:id",
  sellerRequestStartup: "/seller/request-startup",
  sellerBuyerRequest: "/seller/buyer-request/:id",
  sellerRequest: "/seller/request",
  sellerAddStartup: "/seller/add-startup",
  sellerEditStartup: "/seller/edit-startup/:id",
  sellerCompleteProfile: "/seller/complete-profile",
  sellerNotification: "/seller/notification",
  sellerPromotedBusiness: "/seller/promoted-business",
  // App Routes Constants
  signup: "/signup",
  login: "/",
  role: "/role",
  verifyOtp: "/verify-otp",
  verifyBusiness: "/verify-business",
  forgotPassword: "/forgot-password",
  languages: "/language",
  // Buyer Routes Contstants
  buyerMarketplace: "/buyer/marketplace",
  buyerStartupDetail: "/buyer/startup-detail/:id",
  buyerHireExpert: "/buyer/hire-expert",
  buyerHireForm: "/buyer/hire-form/:id",
  buyerDeals: "/buyer/deals",
  buyerSetting: "/buyer/setting",
  buyerrEditProfile: "/buyer/edit-profile",
  buyerUpgrade: "/buyer/upgrade",
  buyerCompleteProfile: "/buyer/complete-profile",
  buyerNotification: "/buyer/notification",
  buyerPromotedBusiness: "/buyer/promoted-business",
};

const BUYER_ROUTES = [
  {
    id: "1",
    path: SCREENS.buyerMarketplace,
    component: lazy(() => import("../Pages/MarketPlace/MarketPlace")),
    nestedPaths: [],
  },
  {
    id: "2",
    path: SCREENS.buyerStartupDetail,
    component: lazy(() => import("../Pages/MarketPlace/StartUpDescription")),
    nestedPaths: [],
  },
  {
    id: "3",
    path: SCREENS.buyerHireExpert,
    component: lazy(() => import("../Pages/MarketPlace/HireExpert/HireExpert")),
    nestedPaths: [],
  },
  {
    id: "4",
    path: SCREENS.buyerHireForm,
    component: lazy(() =>
      import("../Pages/MarketPlace/HireExpert/HireExpertForm")
    ),
    nestedPaths: [],
  },
  {
    id: "5",
    path: SCREENS.buyerDeals,
    component: lazy(() => import("../Pages/MyDeals")),
    nestedPaths: [],
  },
  {
    id: "6",
    path: SCREENS.buyerSetting,
    component: lazy(() => import("../Pages/Settings")),
    nestedPaths: [],
  },
  {
    id: "7",
    path: SCREENS.buyerrEditProfile,
    component: lazy(() => import("../Pages/Settings/EditProfile")),
    nestedPaths: [],
  },
  {
    id: "8",
    path: SCREENS.buyerUpgrade,
    component: lazy(() => import("../Pages/Upgrade")),
    nestedPaths: [],
  },
  {
    id: "9",
    path: SCREENS.buyerCompleteProfile,
    component: lazy(() => import("../Pages/CompleteProfile")),
    nestedPaths: [],
  },
  {
    id: "10",
    path: SCREENS.promoteBuyerStartup,
    component: lazy(() => import("../Pages/MyListing/Promote/PromotePackage")),
    nestedPaths: [],
  },
  {
    id: "11",
    path: SCREENS.buyerNotification,
    component: lazy(() => import("../Pages/Notification")),
    nestedPath: [],
  },
  {
    id: "12",
    path: SCREENS.buyerPromotedBusiness,
    component: lazy(() => import("../Pages/PromotedBusiness")),
    nestedPath: [],
  },
];

const SELLER_ROUTES = [
  {
    id: "1",
    path: SCREENS.sellerSetting,
    component: lazy(() => import("../Pages/Settings")),
    nestedPaths: [],
  },
  {
    id: "2",
    path: SCREENS.sellerEditProfile,
    component: lazy(() => import("../Pages/Settings/EditProfile")),
    nestedPaths: [],
  },
  {
    id: "3",
    path: SCREENS.sellerListing,
    component: lazy(() => import("../Pages/MyListing")),
    nestedPaths: [],
  },
  {
    id: "5",
    path: SCREENS.sellerStartupDetail,
    component: lazy(() => import("../Pages/MarketPlace/StartUpDescription")),
    nestedPaths: [],
  },
  {
    id: "6",
    path: SCREENS.sellerHireExpert,
    component: lazy(() => import("../Pages/MarketPlace/HireExpert/HireExpert")),
    nestedPaths: [],
  },
  {
    id: "7",
    path: SCREENS.sellerHireForm,
    component: lazy(() =>
      import("../Pages/MarketPlace/HireExpert/HireExpertForm")
    ),
    nestedPaths: [],
  },
  {
    id: "8",
    path: SCREENS.sellerRequestStartup,
    component: lazy(() => import("../Pages/BuyerRequest/BuyerRequestStartup")),
    nestedPaths: [],
  },
  {
    id: "9",
    path: SCREENS.sellerRequest,
    component: lazy(() => import("../Pages/BuyerRequest/Request")),
    nestedPaths: [],
  },
  {
    id: "10",
    path: SCREENS.sellerAddStartup,
    component: lazy(() => import("../Pages/Startups")),
    nestedPaths: [],
  },
  {
    id: "11",
    path: SCREENS.sellerCompleteProfile,
    component: lazy(() => import("../Pages/CompleteProfile")),
    nestedPaths: [],
  },
  {
    id: "12",
    path: SCREENS.sellerEditStartup,
    component: lazy(() => import("../Pages/EditStartup")),
    nestedPaths: [],
  },
  {
    id: "13",
    path: SCREENS.sellerBuyerRequest,
    component: lazy(() =>
      import("../Pages/BuyerRequest/BuyerRequest/BuyerRequestList")
    ),
    nestedPaths: [],
  },
  {
    id: "14",
    path: SCREENS.promoteSellerStartup,
    component: lazy(() => import("../Pages/MyListing/Promote/PromotePackage")),
    nestedPaths: [],
  },
  {
    id: "15",
    path: SCREENS.sellerNotification,
    component: lazy(() => import("../Pages/Notification")),
    nestedPath: [],
  },
];

const APP_ROUTES = [
  {
    id: "1",
    path: SCREENS.signup,
    component: lazy(() => import("../Pages/Auth/SignUp")),
    nestedPaths: [],
  },

  {
    id: "2",
    path: SCREENS.login,
    component: lazy(() => import("../Pages/Auth/Login")),
    nestedPaths: [],
  },
  {
    id: "3",
    path: SCREENS.role,
    component: lazy(() => import("../Pages/Auth/UserType")),
    nestedPaths: [],
  },
  {
    id: "4",
    path: SCREENS.verifyOtp,
    component: lazy(() => import("../Pages/Auth/VerifyOtp")),
    nestedPaths: [],
  },
  {
    id: "5",
    path: SCREENS.verifyBusiness,
    component: lazy(() => import("../Pages/Auth/VerifyBusiness")),
    nestedPaths: [],
  },
  {
    id: "6",
    path: SCREENS.forgotPassword,
    component: lazy(() => import("../Pages/Auth/ForgetPassword")),
    nestedPaths: [],
  },
  {
    id: "7",
    path: SCREENS.languages,
    component: lazy(() => import("../Pages/Auth/ChangeLanguage")),
    nestedPath: [],
  },
];

export { BUYER_ROUTES, SCREENS, APP_ROUTES, SELLER_ROUTES };
