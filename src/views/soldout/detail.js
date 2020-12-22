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

  const [detail, setDetail] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [csStatus, setCsStatus] = useState("*");
  const [bankList, setBankList] = useState([]);
  const [bankCode, setBankCode] = useState("002");
  const [bankAccount, setBankAccount] = useState("");
  const [msgModal, setMsgModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [toastLog, setToastLog] = useState("");
  const [bankUserName, setBankUserName] = useState("");
  const [excPrice, setExcPrice] = useState("");
  const [excName, setExcName] = useState("");
  const [excOpt1, setExcOpt1] = useState("");
  const [excOpt2, setExcOpt2] = useState("");
  const [msg, setMsg] = useState("");

  // component unmount 시 state 초기화
  const clearState = () => {
    setDetail([]);
    setRedirect(false);
    setCsStatus("*");
    setBankList([]);
    setBankCode("002");
    setBankAccount("");
    setMsgModal(false);
    setLoading(true);
    setToast(false);
    setToastLog("");
    setBankUserName("");
    setExcPrice("");
    setExcName("");
    setExcOpt1("");
    setExcOpt2("");
    setMsg("");
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
    if (token === null || token === undefined) {
      setRedirect(true);
      return () => clearState();
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
    if (token === null || token === undefined) {
      setRedirect(true);
      return () => clearState();
    }

    getDetail(token);
    return () => clearState();
  }, [token, getDetail]);

  // CS상태 최초 Select 변경
  useEffect(() => {
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
    if (productInfo !== undefined) {
      setCsStatus(statusToCode(productInfo.origin_action));
    }
    return () => clearState();
  }, [productInfo]);

  if (productInfo !== undefined) {
    const mallID = productInfo.mall_id;
    const productNo = productInfo.product_no;
    const orderID = productInfo.order_id;
    const productPrice = productInfo.price;
    const paymentMethod = productInfo.payment_method;
    const shopName = productInfo.bizName;
    const userName = productInfo.user_name;
    const productName = productInfo.product_name;

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
            if (res.data !== undefined) {
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
                    if (res.data !== undefined) {
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
        if (paymentMethod === "cash") {
          if (bankAccount === "" || bankUserName === "") return;
        }

        axios({
          method: "get",
          url: `https://sol.piclick.kr/soldOut/refundOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
        })
          .then((res) => {
            if (res.data !== undefined) {
              if (res.data.status === "T") {
                const requestParam = () => {
                  if (paymentMethod === "cash") {
                    return {
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
                  } else {
                    return {
                      action_code: csStatus,
                      price: productPrice,
                      idx: index,
                      status_msg: res.data.res.message,
                      status_code: res.data.res.code,
                    };
                  }
                };
                // 환불 상태변화, 로그 API 전송
                axios({
                  method: "post",
                  url: `https://sadmin.piclick.kr/soldout/action`,
                  headers: {
                    Authorization: `JWT ${token}`,
                  },
                  data: requestParam(),
                })
                  .then((res) => {
                    if (res.data !== undefined) {
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
            if (res.data !== undefined) {
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
      } else if (csStatus === "E") {
        if (excName === "" || excPrice === "") {
          return;
        }
        const requestParam = () => {
          if (bankAccount === "" || bankUserName === "") {
            return {
              action_code: csStatus,
              product_name: excName, // 새로운 교환품 이름
              product_option1: excOpt1, // 새로운 교환품 옵션 1
              product_option2: excOpt2, // 새로운 교환품 옵션2
              price: excPrice, // 새로운 교환품 가격
              idx: index,
            };
          } else {
            return {
              action_code: csStatus,
              product_name: excName, // 새로운 교환품 이름
              product_option1: excOpt1, // 새로운 교환품 옵션 1
              product_option2: excOpt2, // 새로운 교환품 옵션2
              price: excPrice, // 새로운 교환품 가격
              bank_code_std: bankCode,
              account_num: bankAccount,
              bank_user_name: bankUserName,
              idx: index,
            };
          }
        };
        // 교환 로그 API 전송
        axios({
          method: "post",
          url: `https://sadmin.piclick.kr/soldout/action`,
          headers: {
            Authorization: `JWT ${token}`,
          },
          data: requestParam(),
        })
          .then((res) => {
            if (res.data !== undefined) {
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
        } else if (name === "excPrice") {
          setExcPrice(value);
        } else if (name === "excOpt1") {
          setExcOpt1(value);
        } else if (name === "excOpt2") {
          setExcOpt2(value);
        }
      } else {
        if (name === "bankAccount") {
          setBankAccount(value);
        } else if (name === "bankUserName") {
          setBankUserName(value);
        } else if (name === "excName") {
          setExcName(value);
        } else if (name === "excOpt1") {
          setExcOpt1(value);
        } else if (name === "excOpt2") {
          setExcOpt2(value);
        } else {
          setBankAccount("");
          setExcPrice("");
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
      axios({
        method: "get",
        url: `https://sadmin.piclick.kr/soldout/sms/preview?idx=14864`,
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
        .then((res) => {
          setMsg(res.data);
        })
        .catch((error) => console.log(error));
    };

    const fields = [
      { key: "action_date", label: "상태 갱신 일자" },
      { key: "action", label: "처리상태" },
      { key: "product_name", label: "교환 상품명" },
      { key: "product_option1", label: "교환 상품 옵션1" },
      { key: "product_option2", label: "교환 상품 옵션2" },
      { key: "price", label: "교환 상품 가격" },
      { key: "bank_name", label: "은행명" },
      { key: "account_num", label: "계좌번호" },
      { key: "bank_user_name", label: "예금주" },
    ];

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

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
                  <CCol lg="2">
                    <CSelect onChange={csSelectChange} value={csStatus}>
                      <option value="*" disabled>
                        판매중지
                      </option>
                      <option value="E">교환</option>
                      <option value="R">환불</option>
                      <option value="S">적립</option>
                      <option value="O">재입고</option>
                    </CSelect>
                  </CCol>
                  <CCol lg="3">
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
                      <CInput
                        name="bankAccount"
                        value={bankAccount}
                        onChange={onInputChange}
                        placeholder="계좌번호"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol lg="2">
                    <CInputGroup>
                      <CInput
                        name="bankUserName"
                        placeholder="예금주"
                        value={bankUserName}
                        onChange={onInputChange}
                      ></CInput>
                      <CButton
                        color="primary"
                        onClick={postCsStatus}
                        disabled={csStatus === "*"}
                      >
                        CS상태 변경
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </>
              ) : csStatus === "E" ? (
                <>
                  <CCol lg="2">
                    <CInputGroup>
                      <CSelect onChange={csSelectChange} value={csStatus}>
                        <option value="*" disabled>
                          판매중지
                        </option>
                        <option value="E">교환</option>
                        <option value="R">환불</option>
                        <option value="S">적립</option>
                        <option value="O">재입고</option>
                      </CSelect>
                    </CInputGroup>
                  </CCol>
                  <CCol lg="3">
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
                      <CInput
                        name="bankAccount"
                        value={bankAccount}
                        onChange={onInputChange}
                        placeholder="계좌번호"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol lg="2">
                    <CInputGroup>
                      <CInput
                        name="bankUserName"
                        placeholder="예금주"
                        value={bankUserName}
                        onChange={onInputChange}
                      ></CInput>
                    </CInputGroup>
                  </CCol>
                  <CCol>
                    <CInputGroup>
                      <CInput
                        placeholder="상품명"
                        name="excName"
                        value={excName}
                        onChange={onInputChange}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol>
                    <CInputGroup>
                      <CInput
                        placeholder="옵션1"
                        name="excOpt1"
                        value={excOpt1}
                        onChange={onInputChange}
                      />
                      <CInput
                        placeholder="옵션2"
                        name="excOpt2"
                        value={excOpt2}
                        onChange={onInputChange}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol>
                    <CInputGroup>
                      <CInput
                        placeholder="가격"
                        name="excPrice"
                        value={excPrice}
                        onChange={onInputChange}
                      />
                      <CButton
                        color="primary"
                        onClick={postCsStatus}
                        disabled={csStatus === "*"}
                      >
                        CS상태 변경
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </>
              ) : (
                <CCol lg="3">
                  <CInputGroup>
                    <CSelect onChange={csSelectChange} value={csStatus}>
                      <option value="*" disabled>
                        판매중지
                      </option>
                      <option value="E">교환</option>
                      <option value="R">환불</option>
                      <option value="S">적립</option>
                      <option value="O">재입고</option>
                    </CSelect>
                    <CButton
                      color="primary"
                      onClick={postCsStatus}
                      disabled={csStatus === "*"}
                    >
                      CS상태 변경
                    </CButton>
                  </CInputGroup>
                </CCol>
              )}
            </CFormGroup>
            <CFormGroup row>
              <CCol>
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
              <h6
                style={{ color: "#999", textAlign: "right", fontSize: "12px" }}
              >
                문자 중복 전송을 방지하기 위해 CS상태를 "판매중지"로 변경 불가능
                하며, 다른 선택지가 선택되면 버튼이 활성화 됩니다.
              </h6>
            </CFormGroup>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            <CDataTable
              items={detail}
              fields={fields}
              scopedSlots={{
                product_name: (item) => (
                  <td>{item.product_name !== null ? item.product_name : ""}</td>
                ),
                product_option1: (item) => (
                  <td>
                    {item.product_option1 !== null ? item.product_option1 : ""}
                  </td>
                ),
                product_option2: (item) => (
                  <td>
                    {item.product_option2 !== null ? item.product_option2 : ""}
                  </td>
                ),
                price: (item) => (
                  <td>
                    {item.price !== null ? numberWithCommas(item.price) : ""}
                  </td>
                ),
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
            {msg.split("\n").map((line) => {
              return (
                <span>
                  {line}
                  <br />
                </span>
              );
            })}
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
  } else {
    return <Redirect to="/" />;
  }
}

export default SoldOutDetail;
