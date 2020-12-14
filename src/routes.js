import React from "react";
const SoldOut = React.lazy(() => import("./views/soldout/SoldOut"));
const Detail = React.lazy(() => import("./views/soldout/SoldOutDetail"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/soldout", name: "SoldOut", component: SoldOut },
  { path: "/detail/:id", name: "Detail", component: Detail },
];

export default routes;
