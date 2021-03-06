import React from "react";
const SoldOutReport = React.lazy(() => import("./views/soldout/SoldOutReport"));
const SoldOut = React.lazy(() => import("./views/soldout/SoldOut"));
const Detail = React.lazy(() => import("./views/soldout/detail"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/soldout", exact: true, name: "SoldOut", component: SoldOut },
  { path: "/soldout/report", name: "SoldOutReport", component: SoldOutReport },
  { path: "/soldout/:idx/:order_no", name: "Detail", component: Detail },
];

export default routes;
