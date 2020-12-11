import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CNavbar, CCollapse, CNavbarNav, CButton } from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { Redirect } from "react-router-dom";

const TheHeader = () => {
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const logoutClick = () => {
    sessionStorage.removeItem("userToken");
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <CNavbar expandable="sm">
      <CCollapse navbar>
        <CButton
          inHeader
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        >
          <CIcon name="cil-menu" size="xl" />
        </CButton>
        <CButton
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        >
          <CIcon name="cil-menu" size="xl" />
        </CButton>
        <CNavbarNav className="ml-auto">
          <CButton color="light" className="my-2 my-sm-0" onClick={logoutClick}>
            로그아웃
          </CButton>
        </CNavbarNav>
      </CCollapse>
    </CNavbar>
  );
};

export default TheHeader;
