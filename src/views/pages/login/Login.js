import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CLabel,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const inputChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "id") {
      setId(value);
    } else {
      setPassword(value);
    }
  };

  const loginSubmit = (event) => {
    event.preventDefault();

    axios({
      method: "post",
      url: "https://sadmin.piclick.kr/auth",
      data: {
        username: id,
        password: password,
      },
    })
      .then((res) => {
        sessionStorage.setItem("userToken", res.data.access_token);
        setIsInvalid(false);
        setIsLogin(true);
      })
      .catch((error) => {
        setIsInvalid(true);
        setIsLogin(false);
      });
  };

  if (isLogin === true) {
    return <Redirect to="/" />;
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCard className="p-4">
              <CCardBody>
                <CForm
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <CLabel>
                    <CIcon
                      name="logo"
                      height={25}
                      style={{ marginBottom: "30px" }}
                    />
                  </CLabel>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="text"
                      name="id"
                      placeholder="ID"
                      autoComplete="username"
                      value={id}
                      onChange={inputChange}
                      className={isInvalid ? "is-invalid" : ""}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      name="password"
                      placeholder="비밀번호"
                      autoComplete="current-password"
                      value={password}
                      onChange={inputChange}
                      className={isInvalid ? "is-invalid" : ""}
                    />
                  </CInputGroup>
                  {isInvalid ? (
                    <CLabel>ID나 비밀번호가 일치하지 않습니다.</CLabel>
                  ) : (
                    ""
                  )}
                  <CRow>
                    <CCol>
                      <CButton color="primary" onClick={loginSubmit}>
                        로그인
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
