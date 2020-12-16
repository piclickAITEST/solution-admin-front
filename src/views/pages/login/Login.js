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
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const inputChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "id") {
      setId(value);
      setIsInvalid(false);
    } else {
      setPassword(value);
      setIsInvalid(false);
    }
  };

  const loginSubmit = (event) => {
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
        sessionStorage.setItem("userName", id);
        axios({
          method: "post",
          url: "https://sadmin.piclick.kr/log/soldout/login",
          data: {
            cs_id: id,
            action_code: "CS_LOGIN_SUCCESS",
          },
        });
        setIsInvalid(false);
        setIsLogin(true);
      })
      .catch(() => {
        axios({
          method: "post",
          url: "https://sadmin.piclick.kr/log/soldout/login",
          data: {
            cs_id: id,
            action_code: "CS_LOGIN_FAIL",
          },
        });
        setIsInvalid(true);
        setIsLogin(false);
      });
  };

  const onInputPress = (event) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      loginSubmit();
    }
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
                      onKeyDown={onInputPress}
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
                      onKeyDown={onInputPress}
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
                    <CLabel>
                      계정 정보가 존재하지 않습니다.
                      <br />
                      ID와 비밀번호를 다시 확인하세요.
                    </CLabel>
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
