import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CInput,
  CInputGroup,
  CSelect,
  CFormGroup,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CLabel,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from "@coreui/react";
import { Redirect, Link } from "react-router-dom";

const SoldOut = () => {
  const [products, setProducts] = useState([]);
  const [dateType, setDateType] = useState("");
  const [searchType, setSearchType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectOpt, setSelectOpt] = useState("상품명");
  const [searchValue, setSearchValue] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [index, setIndex] = useState("");
  const [msgToastLog, setMsgToastLog] = useState("");
  const [msgToastToggle, setMsgToastToggle] = useState(false);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberWithPhone(x) {
    if (x.length < 10) {
      return x.toString().replace(/(\d{2})(\d{3})(\d{3,4})/, "$1-$2-$3");
    } else {
      return x.toString().replace(/(\d{2,3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }

  const getSoldOut = async (args) => {
    const token = sessionStorage.getItem("userToken");
    if (args === undefined) {
      args = "";
    }
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }
    await axios({
      method: "get",
      url: `https://sadmin.piclick.kr/soldout/${args}`,
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        if (res.data === undefined) {
          setProducts([]);
        } else {
          setProducts(res.data.results);
        }
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
    getSoldOut();
    const getEveryTimes = setInterval(() => {
      getSoldOut();
    }, 60000 * 10);

    return () => clearInterval(getEveryTimes);
  }, []);

  const changedateType = (event) => {
    event.persist();
    setDateType(event.target.innerText);
    switch (event.target.innerText) {
      case "오늘":
        setFromDate(moment().format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        break;
      case "어제":
        setFromDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        setToDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        break;
      case "1주":
        setFromDate(moment().subtract(1, "weeks").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        break;
      case "1개월":
        setFromDate(moment().subtract(1, "months").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        break;
      default:
        break;
    }
  };

  const changeSearchType = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "주문일자":
        setSearchType(value);
        break;
      case "품절일자":
        setSearchType(value);
        break;
      default:
        break;
    }
  };

  const onSearchClick = (event) => {
    const {
      target: { name },
    } = event;

    switch (name) {
      case "search":
        if (fromDate === "" || toDate === "") {
          if (searchType === "") {
            if (searchValue === "") {
              getSoldOut();
            } else {
              //검색어만
              if (selectOpt === "상품명") {
                getSoldOut(`?pname=${searchValue}`);
              } else if (selectOpt === "상품ID") {
                getSoldOut(`?pid=${searchValue}`);
              } else if (selectOpt === "주문자") {
                getSoldOut(`?uname=${searchValue}`);
              } else {
                getSoldOut(`?oid=${searchValue}`);
              }
            }
          } else {
            if (searchValue === "") {
              getSoldOut();
            } else {
              //검색어만
              if (selectOpt === "상품명") {
                getSoldOut(`?pname=${searchValue}`);
              } else if (selectOpt === "상품ID") {
                getSoldOut(`?pid=${searchValue}`);
              } else if (selectOpt === "주문자") {
                getSoldOut(`?uname=${searchValue}`);
              } else {
                getSoldOut(`?oid=${searchValue}`);
              }
            }
          }
        } else {
          if (searchType === "") {
            if (searchValue === "") {
              getSoldOut();
            } else {
              //검색어만
              if (selectOpt === "상품명") {
                getSoldOut(`?pname=${searchValue}`);
              } else if (selectOpt === "상품ID") {
                getSoldOut(`?pid=${searchValue}`);
              } else if (selectOpt === "주문자") {
                getSoldOut(`?uname=${searchValue}`);
              } else {
                getSoldOut(`?oid=${searchValue}`);
              }
            }
          } else {
            if (searchValue === "") {
              //날짜만
              getSoldOut(
                `?from_date=${moment(fromDate).format(
                  "YYYYMMDD"
                )}&to_date=${moment(toDate).format(
                  "YYYYMMDD"
                )}&date_type=${searchType}`
              );
            } else {
              //검색어, 날짜 둘다
              if (selectOpt === "상품명") {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&pname=${searchValue}`
                );
              } else if (selectOpt === "주문자") {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&uname=${searchValue}`
                );
              } else if (selectOpt === "상품ID") {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&pid=${searchValue}`
                );
              } else {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&oid=${searchValue}`
                );
              }
            }
          }
        }
        break;
      case "clear":
        setFromDate("");
        setToDate("");
        setDateType("");
        setSelectOpt("상품명");
        setSearchType("");
        setSearchValue("");
        getSoldOut();
        break;
      default:
        break;
    }
  };

  const onSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectOpt(value);
  };

  const onChangeDate = (event) => {
    const {
      target: { name, value },
    } = event;

    switch (name) {
      case "fromDate":
        setFromDate(value);
        break;
      case "toDate":
        setToDate(value);
        break;
      default:
        break;
    }
  };

  const sendToggle = (idx) => {
    setSendModal(!sendModal);
    setIndex(idx);
  };

  const previewToggle = (product_no, order_id) => {
    var url = `https://sol.piclick.kr/soldOut/?mallID=rlackdals1&product_no=${product_no}&order_id=${order_id}`;
    window.open(
      url,
      "_blank",
      "menubar=no, resizable=no, width=360, height=640"
    );
  };

  const searchValueChange = (event) => {
    const {
      target: { value },
    } = event;

    setSearchValue(value);
  };

  const sendMessage = async () => {
    const token = sessionStorage.getItem("userToken");
    await axios
      .get(`https://sadmin.piclick.kr/soldout/sms?idx=${index}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then((res) => {
        if (res.data !== undefined) {
          if (res.data.results.result_code === "1") {
            setMsgToastToggle(true);
            setMsgToastLog("성공적으로 메시지를 전송하였습니다.");
            setSendModal(false);
            setIndex("");

            const action = document.querySelector(`#action-${index}`);
            const button = document.querySelector(`#button-${index}`);
            action.innerText = "메세지전송";
            button.setAttribute("disabled", "");
          } else {
            setSendModal(false);
            setIndex("");
          }
        } else {
          setMsgToastToggle(true);
          setMsgToastLog("메시지를 전송하지 못했습니다.");
          setTimeout(() => {
            setMsgToastToggle(false);
          }, 3000);
          setSendModal(false);
          setIndex("");
        }
      })
      .catch((error) => {
        setMsgToastToggle(true);
        setMsgToastLog("메시지를 전송하지 못했습니다.");
        setTimeout(() => {
          setMsgToastToggle(false);
        }, 3000);
        setSendModal(false);
        setIndex("");
      });
  };

  if (redirect) {
    return <Redirect from="*" to="/login" />;
  }

  return (
    <>
      <CCard>
        <CCardBody>
          <CFormGroup row>
            <CCol xs="3">
              <CLabel>시작일/종료일</CLabel>
              <CInputGroup>
                <CInput
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={fromDate}
                  onChange={onChangeDate}
                />
                <CInput
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={toDate}
                  onChange={onChangeDate}
                />
              </CInputGroup>
            </CCol>
            <CCol xs="0">
              <CLabel>날짜 선택기준</CLabel>
              <CInputGroup>
                <CButtonGroup>
                  {[
                    ["주문일자", "order"],
                    ["품절일자", "soldout"],
                  ].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value[1]}
                      name={value[0]}
                      className="mx-0"
                      active={value[1] === searchType}
                      value={value[1]}
                      onClick={changeSearchType}
                    >
                      {value[0]}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CInputGroup>
            </CCol>
            <CCol>
              <CLabel>날짜 선택범위</CLabel>
              <CInputGroup>
                <CButtonGroup>
                  {["오늘", "어제", "1주", "1개월"].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === dateType}
                      onClick={changedateType}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CInputGroup>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol xs="3">
              <CInputGroup>
                <CSelect
                  custom
                  name="search-filter"
                  id="search-filter"
                  onChange={onSelectChange}
                  value={selectOpt}
                >
                  <option value="상품명">상품명</option>
                  <option value="상품ID">상품ID</option>
                  <option value="주문자">주문자</option>
                  <option value="주문번호">주문번호</option>
                </CSelect>
                <CInput
                  type="text"
                  id="nf-email"
                  name="nf-email"
                  placeholder="검색"
                  value={searchValue}
                  onChange={searchValueChange}
                />
              </CInputGroup>
            </CCol>
            <CCol>
              <CInputGroup>
                <CButton color="primary" name="search" onClick={onSearchClick}>
                  검색
                </CButton>
                <CButton name="clear" onClick={onSearchClick}>
                  초기화
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
                <th className="text-center">
                  주문일자
                  <br />
                  품절일자
                </th>
                <th className="text-center">주문번호</th>
                <th className="text-center">상품명</th>
                <th className="text-center">옵션 1</th>
                <th className="text-center">옵션 2</th>
                <th className="text-center">이미지</th>
                <th className="text-center">수량</th>
                <th className="text-center">금액</th>
                <th className="text-center">
                  주문자
                  <br />
                  수령자
                </th>
                <th className="text-center">
                  주문자 휴대폰
                  <br />
                  주문자 전화번호
                </th>
                <th className="text-center">CS 상태</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const {
                  action,
                  idx,
                  list_image,
                  option1,
                  option2,
                  order_date,
                  order_id,
                  phone,
                  price,
                  product_name,
                  qty,
                  user_name,
                  product_id,
                  soldout_date,
                  mall_id,
                  payment_method,
                  bizName,
                } = product;

                return (
                  <tr key={idx}>
                    <td className="text-center">
                      {order_date}
                      <br />
                      {soldout_date}
                    </td>
                    <td className="text-center">{order_id}</td>
                    <td className="text-center">{product_name}</td>
                    <td className="text-center">{option1}</td>
                    <td className="text-center">{option2}</td>
                    <td className="text-center">
                      <img
                        src={list_image}
                        alt={product_name}
                        style={{ width: "65px" }}
                      />
                    </td>
                    <td className="text-center">{qty}</td>
                    <td className="text-center">{numberWithCommas(price)}원</td>
                    <td className="text-center">{user_name}</td>
                    <td className="text-center">{numberWithPhone(phone)}</td>
                    <td className="text-center action">
                      <CLabel id={`action-${idx}`}>{action}</CLabel>
                      <br />
                      <Link
                        to={{
                          pathname: `/detail/${idx}/${order_id}`,
                          productInfo: {
                            price: price,
                            mall_id: mall_id,
                            product_no: product_id,
                            order_id: order_id,
                            payment_method: payment_method,
                            bizName: bizName,
                            user_name: user_name,
                            product_name: product_name,
                            order_date: order_date,
                            option1: option1,
                            option2: option2,
                            qty: qty,
                          },
                        }}
                      >
                        <CButton color="secondary">상세정보</CButton>
                      </Link>
                    </td>
                    <td className="text-center">
                      <CButton
                        onClick={() => {
                          previewToggle(product_id, order_id);
                        }}
                      >
                        미리보기
                      </CButton>
                      <CButton
                        color="primary"
                        disabled={action !== "품절대상"}
                        onClick={() => sendToggle(idx)}
                        id={`button-${idx}`}
                      >
                        전송
                      </CButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CModal show={sendModal} onClose={sendToggle}>
        <CModalHeader>메시지 전송</CModalHeader>
        <CModalBody>메시지를 전송하시겠습니까?</CModalBody>
        <CModalFooter>
          <CButton onClick={sendToggle} color="secondary">
            닫기
          </CButton>
          <CButton onClick={sendMessage} color="primary">
            전송
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster position="top-right">
        <CToast show={msgToastToggle} autohide={3000} fade={true}>
          <CToastHeader>메시지 전송</CToastHeader>
          <CToastBody>{msgToastLog}</CToastBody>
        </CToast>
      </CToaster>
    </>
  );
};

export default SoldOut;
