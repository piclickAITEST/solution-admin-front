import React from "react";
const SoldOut = React.lazy(() => import("./views/soldout/SoldOut"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/soldout", name: "SoldOut", component: SoldOut },
];

export default routes;
