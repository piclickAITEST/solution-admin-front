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
  CLabel,
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

  const [detail, setDetail] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [csStatus, setCsStatus] = useState("R");
  const [bankList, setBankList] = useState([]);
  const [bankCode, setBankCode] = useState("002");
  const [bankAccount, setBankAccount] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [msgModal, setMsgModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [toastLog, setToastLog] = useState("");

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberWithPhone(x) {
    if (x === undefined || x === null) {
      return;
    }
    if (x.length < 10) {
      return x.toString().replace(/(\d{2})(\d{3})(\d{3,4})/, "$1-$2-$3");
    } else {
      return x.toString().replace(/(\d{2,3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }

  // component unmount 시 state 초기화
  const clearState = () => {
    setRedirect(false);
    setCsStatus("R");
    setBankList([]);
    setDetail([]);
    setBankCode("002");
    setBankAccount("");
    setCountryCode("");
    setLoading(true);
    setToast(false);
    setToastLog("");
  };

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

  // 은행 리스트 가져오기
  useEffect(() => {
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }

    getbankList(token);
    return () => clearState();
  }, [token]);

  const enableToast = (msg) => {
    setToastLog(msg);
    setToast(true);
    setTimeout(() => {
      setToastLog("");
      setToast(false);
    }, 3000);
    getDetail(token);
  };

  // 상세정보 업데이트
  useEffect(() => {
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }

    getDetail(token);
    return () => clearState();
  }, [token, getDetail]);

  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  const csSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    setCsStatus(value);
  };

  const postCsStatus = () => {
    const token = sessionStorage.getItem("userToken");
    if (csStatus === "S") {
      // 적립(Save)
      axios({
        method: "get",
        url: `https://sol.piclick.kr/soldOut/saveOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
      }).then((res) => {
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
                if (error.response.status === 401) {
                  sessionStorage.removeItem("userToken");
                  sessionStorage.removeItem("userName");
                  setRedirect(true);
                }
              });
          } else {
            enableToast("상태 변경 살패.");
          }
        }
      });
    } else if (csStatus === "R") {
      if (bankCode === "" || bankAccount === "") {
        return;
      }
      // 환불 (Refund)
      axios({
        method: "get",
        url: `https://sol.piclick.kr/soldOut/refundOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
      }).then((res) => {
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
              account_holder_info: countryCode,
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
                if (error.response.status === 401) {
                  sessionStorage.removeItem("userToken");
                  sessionStorage.removeItem("userName");
                  setRedirect(true);
                }
              });
          } else {
            enableToast("상태 변경 실패");
          }
        } else {
          getDetail(token);
        }
      });
    }
  };

  const onInputChange = (event) => {
    const {
      target: { value, name },
    } = event;

    if (name === "bankAccount") {
      setBankAccount(value);
    } else {
      setCountryCode(value);
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

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <div>
      <CCard>
        <CCardHeader>
          <Link to="/soldout">
            <CButton>
              <CIcon name="cil-chevron-left" size="lg" />
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <h3>
            {productName} / {numberWithCommas(productPrice)}원 - {userName}
          </h3>
          <CFormGroup row>
            <CCol xs="2">
              <CLabel>CS 상태</CLabel>
              <CSelect onChange={csSelectChange} value={csStatus}>
                <option value="R">환불</option>
                <option value="S">적립</option>
                <option value="E">교환</option>
                {/* <option value="X">처리완료</option> */}
              </CSelect>
            </CCol>
            {paymentMethod === "cash" && csStatus === "R" ? (
              <>
                <CCol xs="2">
                  <CLabel>은행명</CLabel>
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
                <CCol xs="2">
                  <CLabel>계좌 번호</CLabel>
                  <CInput
                    name="bankAccount"
                    value={bankAccount}
                    onChange={onInputChange}
                    placeholder="계좌번호"
                    type="number"
                  />
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
            ) : null}
            <CButton color="primary" onClick={postCsStatus}>
              상태 변경
            </CButton>
            <CCol>
              <CLabel>미리보기</CLabel>
              <CInputGroup>
                <CButton
                  color="secondary"
                  onClick={previewToggle}
                  style={{ marginRight: "5px" }}
                >
                  품절대체 탬플릿
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
          <table className="table table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th className="text-center">상태 갱신 일자</th>
                <th className="text-center">상태 코드</th>
                <th className="text-center">API 출력 내용</th>
                <th className="text-center">계좌번호</th>
                <th className="text-center">주민번호 앞자리</th>
                <th className="text-center">수신자</th>
                <th className="text-center">발신자</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((product) => {
                const {
                  action_date, // 상태 업데이트 날짜 a
                  account_holder_info, // 주민번호 앞자리 a
                  account_num, // 계좌번호 a
                  action_code, // 상태 코드(CS 상태) a
                  receiver, // 수신자 번호 a
                  sender, // 발신자 번호 a
                  id,
                  status_msg,
                } = product;

                return (
                  <tr key={id}>
                    <td className="text-center">{action_date}</td>
                    <td className="text-center">{action_code}</td>
                    <td className="text-center">{status_msg}</td>
                    <td className="text-center">{account_num}</td>
                    <td className="text-center">{account_holder_info}</td>
                    <td className="text-center">{numberWithPhone(receiver)}</td>
                    <td className="text-center">{numberWithPhone(sender)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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