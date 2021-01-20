import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CHeader,
  CToggler,
  CHeaderNav,
} from "@coreui/react";
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
    setUserName(sessionStorage.getItem("userName"));
  };

  useEffect(() => {
    getUsername();
    return () => getUsername;
  }, []);

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <CHeader className="justify-content-between">
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderNav className="px-3 justify-content-between">
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
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
