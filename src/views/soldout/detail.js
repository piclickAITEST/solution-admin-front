import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormGroup,
  CCol,
  CInputGroup,
  CSelect,
  CInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CSpinner,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CDataTable,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useCallback } from "react";

function SoldOutDetail({ match, location }) {
  const token = sessionStorage.getItem("userToken");
  const index = match.params.idx;
  const productInfo = location.productInfo;
  const mallID = productInfo.mall_id;
  const productNo = productInfo.product_no;
  const orderID = productInfo.order_id;
  const productPrice = productInfo.price;
  const paymentMethod = productInfo.payment_method;
  const shopName = productInfo.bizName;
  const userName = productInfo.user_name;
  const productName = productInfo.product_name;
  const orderDate = productInfo.order_date;
  const option1 = productInfo.option1;
  const option2 = productInfo.option2;
  const qty = productInfo.qty;
  const originAction = productInfo.origin_action;

  const statusToCode = (arg) => {
    if (arg === "환불") {
      return "R";
    } else if (arg === "적립") {
      return "S";
    } else if (arg === "교환") {
      return "E";
    } else if (arg === "재입고") {
      return "O";
    } else {
      return "*";
    }
  };

  const [detail, setDetail] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [csStatus, setCsStatus] = useState("");
  const [bankList, setBankList] = useState([]);
  const [bankCode, setBankCode] = useState("002");
  const [bankAccount, setBankAccount] = useState("");
  // const [countryCode, setCountryCode] = useState("");
  const [msgModal, setMsgModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [toastLog, setToastLog] = useState("");
  const [bankUserName, setBankUserName] = useState("");

  // component unmount 시 state 초기화
  const clearState = () => {
    setRedirect(false);
    setCsStatus("");
    setBankList([]);
    setDetail([]);
    setBankCode("002");
    setBankAccount("");
    // setCountryCode("");
    setLoading(true);
    setToast(false);
    setToastLog("");
    setBankUserName("");
  };

  // 은행 목록 가져오기
  const getbankList = (token) => {
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }
    axios({
      method: "get",
      url: "https://sadmin.piclick.kr/soldout/banks",
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        setBankList(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("userName");
          setRedirect(true);
        }
      });
  };

  useEffect(() => {
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }

    getbankList(token);
    return () => clearState();
  }, [token]);

  // 상세 로그 가져오기
  const getDetail = useCallback(
    (token) => {
      axios({
        method: "get",
        url: `https://sadmin.piclick.kr/log/list?idx=${index}`,
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
        .then((res) => {
          if (res.data === undefined) {
            setDetail([]);
          } else {
            setDetail(res.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
          }
        });
    },
    [index]
  );

  useEffect(() => {
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }

    getDetail(token);
    return () => clearState();
  }, [token, getDetail]);

  // CS상태 최초 Select 변경
  useEffect(() => {
    setCsStatus(statusToCode(originAction));
  }, [originAction]);

  // 토스트
  const enableToast = (msg) => {
    setToastLog(msg);
    setToast(true);
    setTimeout(() => {
      setToastLog("");
      setToast(false);
    }, 3000);
    getDetail(token);
  };

  // 토큰이 없을 경우 리다이렉션
  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  // CS 상태 Select 변경 제어
  const csSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    setCsStatus(value);
  };

  // CS 상태 업데이트
  const postCsStatus = () => {
    const token = sessionStorage.getItem("userToken");

    if (csStatus === "*") {
      return;
    } else if (csStatus === "S") {
      // 적립(Save)
      axios({
        method: "get",
        url: `https://sol.piclick.kr/soldOut/saveOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
      })
        .then((res) => {
          if (res.data !== undefined || res.data !== null) {
            if (res.data.status === "T") {
              const requestParam = {
                action_code: csStatus,
                price: productPrice,
                idx: index,
                status_msg: res.data.res.message,
                status_code: res.data.res.code,
              };
              //적립 상태변화, 로그 API 전송
              axios({
                method: "post",
                url: `https://sadmin.piclick.kr/soldout/action`,
                headers: {
                  Authorization: `JWT ${token}`,
                },
                data: requestParam,
              })
                .then((res) => {
                  if (res.data !== undefined || res.data !== null) {
                    enableToast("상태 변경을 하였습니다.");
                  }
                })
                .catch((error) => {
                  if (error.response === undefined) {
                    enableToast("상태 변경 실패");
                  } else {
                    if (error.response.status === 401) {
                      sessionStorage.removeItem("userToken");
                      sessionStorage.removeItem("userName");
                      setRedirect(true);
                    }
                  }
                });
            } else {
              enableToast("상태 변경 실패.");
            }
          }
        })
        .catch((error) => {
          enableToast("상태 변경 실패");
          if (error.response.status === 401) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
            return;
          }
        });
    } else if (csStatus === "R") {
      // 현금(무통장)
      if (paymentMethod === "cash") {
        if (bankCode === "" || bankAccount === "") {
          return;
        } else {
          // 환불 (Refund)
          axios({
            method: "get",
            url: `https://sol.piclick.kr/soldOut/refundOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
          })
            .then((res) => {
              if (res.data !== undefined || res.data !== null) {
                if (res.data.status === "T") {
                  const requestParam = {
                    action_code: csStatus,
                    price: productPrice,
                    idx: index,
                    status_msg: res.data.res.message,
                    status_code: res.data.res.code,
                    account_num: bankAccount,
                    bank_code_std: bankCode,
                    bank_user_name: bankUserName,
                    // account_holder_info: countryCode,
                  };
                  // 환불 상태변화, 로그 API 전송
                  axios({
                    method: "post",
                    url: `https://sadmin.piclick.kr/soldout/action`,
                    headers: {
                      Authorization: `JWT ${token}`,
                    },
                    data: requestParam,
                  })
                    .then((res) => {
                      if (res.data !== undefined || res.data !== null) {
                        enableToast("상태 변경을 하였습니다.");
                        getDetail(token);
                      }
                    })
                    .catch((error) => {
                      if (error.response === undefined) {
                        enableToast("상태 변경 실패");
                      } else {
                        if (error.response.status === 401) {
                          sessionStorage.removeItem("userToken");
                          sessionStorage.removeItem("userName");
                          setRedirect(true);
                        }
                      }
                    });
                } else {
                  enableToast("상태 변경 실패");
                }
              } else {
                getDetail(token);
              }
            })
            .catch((error) => {
              enableToast("상태 변경 실패");
              if (error.response.status === 401) {
                sessionStorage.removeItem("userToken");
                sessionStorage.removeItem("userName");
                setRedirect(true);
                return;
              }
            });
        }
      } else {
        // 무통장 아닐 경우(카드 / 모바일 결제)
        axios({
          method: "get",
          url: `https://sol.piclick.kr/soldOut/refundOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
        })
          .then((res) => {
            if (res.data !== undefined || res.data !== null) {
              if (res.data.status === "T") {
                const requestParam = {
                  action_code: csStatus,
                  price: productPrice,
                  idx: index,
                  status_msg: res.data.res.message,
                  status_code: res.data.res.code,
                };
                // 환불 상태변화, 로그 API 전송
                axios({
                  method: "post",
                  url: `https://sadmin.piclick.kr/soldout/action`,
                  headers: {
                    Authorization: `JWT ${token}`,
                  },
                  data: requestParam,
                })
                  .then((res) => {
                    if (res.data !== undefined || res.data !== null) {
                      enableToast("상태 변경을 하였습니다.");
                      getDetail(token);
                    }
                  })
                  .catch((error) => {
                    if (error.response === undefined) {
                      enableToast("상태 변경 실패");
                    } else {
                      if (error.response.status === 401) {
                        sessionStorage.removeItem("userToken");
                        sessionStorage.removeItem("userName");
                        setRedirect(true);
                      }
                    }
                  });
              } else {
                enableToast("상태 변경 실패");
              }
            } else {
              getDetail(token);
            }
          })
          .catch((error) => {
            enableToast("상태 변경 실패");
            if (error.response.status === 401) {
              sessionStorage.removeItem("userToken");
              sessionStorage.removeItem("userName");
              setRedirect(true);
              return;
            }
          });
      }
    } else if (csStatus === "O") {
      const requestParam = {
        action_code: csStatus,
        price: productPrice,
        idx: index,
      };
      axios({
        method: "post",
        url: `https://sadmin.piclick.kr/soldout/action`,
        headers: {
          Authorization: `JWT ${token}`,
        },
        data: requestParam,
      })
        .then((res) => {
          if (res.data !== undefined || res.data !== null) {
            enableToast("상태 변경을 하였습니다.");
            getDetail(token);
          }
        })
        .catch((error) => {
          enableToast("상태 변경 실패");
          if (error.response.status === 401) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
            return;
          }
        });
    }
  };

  const onInputChange = (event) => {
    const {
      target: { value, name },
    } = event;
    const regex = /^[0-9\b]+$/;

    if (regex.test(event.target.value)) {
      if (name === "bankAccount") {
        setBankAccount(value);
      }
    } else {
      if (name === "bankUserName") {
        setBankUserName(value);
      } else {
        setBankAccount("");
      }
    }
  };

  const bankCodeOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setBankCode(value);
  };

  const previewToggle = () => {
    var url = `https://sol.piclick.kr/soldOut/?mallID=rlackdals1&product_no=${productNo}&order_id=${orderID}`;
    window.open(
      url,
      "_blank",
      "menubar=no, resizable=no, width=360, height=640"
    );
  };

  const msgModalToggle = () => {
    setMsgModal(!msgModal);
  };

  const fields = [
    { key: "action_date", label: "상태 갱신 일자" },
    { key: "action", label: "처리상태" },
    { key: "bank_name", label: "은행명" },
    { key: "account_num", label: "계좌번호" },
    { key: "bank_user_name", label: "예금주" },
  ];

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <div>
      <CCard>
        <CCardHeader>
          <Link to="/soldout_new">
            <CButton>
              <CIcon name="cil-chevron-left" size="lg" />
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <h4>{productName}</h4>
          <h5>{userName}</h5>
          <CFormGroup row>
            {paymentMethod === "cash" && csStatus === "R" ? (
              <>
                <CCol lg="1">
                  <CSelect onChange={csSelectChange} value={csStatus}>
                    <option value="*" disabled>
                      판매중지
                    </option>
                    <option value="R">환불</option>
                    <option value="S">적립</option>
                    {/* <option value="E">교환</option> */}
                    <option value="O">재입고</option>
                  </CSelect>
                </CCol>
                <CCol lg="2">
                  <CInputGroup>
                    <CSelect value={bankCode} onChange={bankCodeOnChange}>
                      {bankList &&
                        bankList.map((bank) => {
                          return (
                            <option value={bank.code} key={bank.code}>
                              {bank.name}
                            </option>
                          );
                        })}
                    </CSelect>
                  </CInputGroup>
                </CCol>
                <CCol lg="4">
                  <CInputGroup>
                    <CInput
                      name="bankAccount"
                      value={bankAccount}
                      onChange={onInputChange}
                      placeholder="계좌번호"
                    />
                    <CInput
                      name="bankUserName"
                      placeholder="예금주"
                      value={bankUserName}
                      onChange={onInputChange}
                    ></CInput>
                    <CButton color="primary" onClick={postCsStatus}>
                      CS상태 변경
                    </CButton>
                  </CInputGroup>
                </CCol>
                {/* <CCol xs="2">
                  <CLabel>주민번호 앞자리</CLabel>
                  <CInputGroup>
                    <CInput
                      name="countryCode"
                      value={countryCode}
                      onChange={onInputChange}
                      placeholder="주민번호 앞자리"
                      type="number"
                    />
                  </CInputGroup>
                </CCol> */}
              </>
            ) : (
              <CCol lg="2">
                <CInputGroup>
                  <CSelect onChange={csSelectChange} value={csStatus}>
                    <option value="*" disabled>
                      판매중지
                    </option>
                    <option value="R">환불</option>
                    <option value="S">적립</option>
                    {/* <option value="E">교환</option> */}
                    <option value="O">재입고</option>
                  </CSelect>
                  <CButton color="primary" onClick={postCsStatus}>
                    CS상태 변경
                  </CButton>
                </CInputGroup>
              </CCol>
            )}
            <CCol lg="3">
              <CInputGroup>
                <CButton
                  color="secondary"
                  onClick={previewToggle}
                  style={{ marginRight: "5px" }}
                >
                  전송된 품절 추천 페이지
                </CButton>
                <CButton color="secondary" onClick={msgModalToggle}>
                  메시지 내용
                </CButton>
              </CInputGroup>
            </CCol>
          </CFormGroup>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CDataTable
            items={detail}
            fields={fields}
            scopedSlots={{
              bank_name: (item) => (
                <td>{item.bank_name !== null ? item.bank_name : ""}</td>
              ),
              account_num: (item) => (
                <td>{item.account_num !== null ? item.account_num : ""}</td>
              ),
              bank_user_name: (item) => (
                <td>
                  {item.bank_user_name !== null ? item.bank_user_name : ""}
                </td>
              ),
            }}
          />
        </CCardBody>
      </CCard>
      <CModal show={msgModal} onClose={msgModalToggle}>
        <CModalHeader>안녕하세요, {shopName} 입니다</CModalHeader>
        <CModalBody>
          안녕하세요. {userName}님! {shopName} 입니다.
          <br />
          안타깝게도 주문하신 상품이 품절되었습니다.
          <br />
          불편을 드려 정말 죄송합니다.
          <br />
          <br />- 주문일시 : {orderDate}
          <br />- 상품명 : {productName} ({option1}
          {option2 ? `- ${option2}` : ""}) 수량 {qty}
          <br />
          <br />
          {`상세 안내 보러가기 ==>`}
          <br />
          <br />
          {`https://sol.piclick.kr/soldOut/?mallID=rlackdals1&product_no=${productNo}&order_id=${orderID}`}
        </CModalBody>
        <CModalFooter>
          <CButton onClick={msgModalToggle} color="secondary">
            닫기
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster position="top-right">
        <CToast show={toast} autohide={3000}>
          <CToastHeader closeButton={false}>상태 변경</CToastHeader>
          <CToastBody>{toastLog}</CToastBody>
        </CToast>
      </CToaster>
    </div>
  );
}

export default SoldOutDetail;
