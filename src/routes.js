import React from "react";
const SoldOutReport = React.lazy(() => import("./views/soldout/SoldOutReport"));
const SoldOut = React.lazy(() => import("./views/soldout/SoldOut"));
const SoldOutNew = React.lazy(() => import("./views/soldout/SoldOutNew"));
const Detail = React.lazy(() => import("./views/soldout/detail"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/soldout", exact: true, name: "SoldOut", component: SoldOut },
  {
    path: "/soldout_new",
    name: "SoldOutNew",
    component: SoldOutNew,
  },
  { path: "/soldout/report", name: "SoldOutReport", component: SoldOutReport },
  { path: "/soldout/:idx/:order_no", name: "Detail", component: Detail },
];

export default routes;
