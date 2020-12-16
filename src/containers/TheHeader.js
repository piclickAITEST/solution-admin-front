import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  CNavbar,
  CCollapse,
  CNavbarNav,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { Redirect } from "react-router-dom";

const TheHeader = () => {
  const [redirect, setRedirect] = useState(false);
  const [username, setUserName] = useState("");
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
    axios({
      method: "POST",
      url: "https://sadmin.piclick.kr/log/soldout/logout",
      data: {
        cs_id: sessionStorage.getItem("userName"),
        action_code: "CS_LOGOUT",
      },
    });
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    setRedirect(true);
  };

  const getUsername = async () => {
    const res = await axios.get("https://sadmin.piclick.kr/users/", {
      headers: {
        Authorization: `JWT ${sessionStorage.getItem("userToken")}`,
      },
    });
    if (res.data.name === undefined) {
      setUserName("");
    } else {
      setUserName(res.data.name);
    }
  };

  useEffect(() => {
    getUsername();
    return () => getUsername;
  }, []);

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <CNavbar expandable="sm" sticky={true} color="white">
      <CCollapse navbar>
        <CButton className="ml-md-3 d-lg-none" onClick={toggleSidebarMobile}>
          <CIcon name="cil-menu" size="xl" />
        </CButton>
        <CButton className="ml-3 d-md-down-none" onClick={toggleSidebar}>
          <CIcon name="cil-menu" size="xl" />
        </CButton>
        <CNavbarNav className="ml-auto">
          <CDropdown>
            <CDropdownToggle>
              <strong>{username}</strong>
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem className="my-2 my-sm-0" onClick={logoutClick}>
                로그아웃
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavbarNav>
      </CCollapse>
    </CNavbar>
  );
};

export default TheHeader;
