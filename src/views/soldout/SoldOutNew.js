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
  CSpinner,
  CDataTable,
} from "@coreui/react";
import { Redirect, Link } from "react-router-dom";

const SoldOutNew = () => {
  const token = sessionStorage.getItem("userToken");
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
  const [loading, setLoading] = useState(true);

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

  const getSoldOut = (args, token) => {
    if (args === undefined || args === "") {
      args = "";
    }

    axios({
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
          setLoading(false);
        }
      })
      .catch((error) => {
        if (
          error.responce.status !== undefined ||
          error.responce.status !== null
        ) {
          if (error.response.status === 401) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
          }
        } else {
          console.log(error);
        }
      });
  };

  const clearState = () => {
    setProducts([]);
    setDateType("");
    setSearchType("");
    setFromDate("");
    setToDate("");
    setSelectOpt("상품명");
    setSearchValue("");
    setRedirect(false);
    setSendModal(false);
    setIndex("");
    setMsgToastLog("");
    setMsgToastToggle(false);
    setLoading(true);
  };

  useEffect(() => {
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }
    getSoldOut("", token);
    const getEveryTimes = setInterval(() => {
      getSoldOut("", token);
    }, 60000 * 10);

    return () => {
      clearInterval(getEveryTimes);
      clearState();
    };
  }, [token]);

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
              getSoldOut("", token);
            } else {
              //검색어만
              if (selectOpt === "상품명") {
                getSoldOut(`?pname=${searchValue}`, token);
              } else if (selectOpt === "상품ID") {
                getSoldOut(`?pid=${searchValue}`, token);
              } else if (selectOpt === "주문자") {
                getSoldOut(`?uname=${searchValue}`, token);
              } else {
                getSoldOut(`?oid=${searchValue}`, token);
              }
            }
          } else {
            if (searchValue === "") {
              getSoldOut("", token);
            } else {
              //검색어만
              if (selectOpt === "상품명") {
                getSoldOut(`?pname=${searchValue}`, token);
              } else if ((selectOpt === "상품ID", token)) {
                getSoldOut(`?pid=${searchValue}`, token);
              } else if (selectOpt === "주문자") {
                getSoldOut(`?uname=${searchValue}`, token);
              } else {
                getSoldOut(`?oid=${searchValue}`, token);
              }
            }
          }
        } else {
          if (searchType === "") {
            if (searchValue === "") {
              getSoldOut("", token);
            } else {
              //검색어만
              if (selectOpt === "상품명") {
                getSoldOut(`?pname=${searchValue}`, token);
              } else if (selectOpt === "상품ID") {
                getSoldOut(`?pid=${searchValue}`, token);
              } else if (selectOpt === "주문자") {
                getSoldOut(`?uname=${searchValue}`, token);
              } else {
                getSoldOut(`?oid=${searchValue}`, token);
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
                )}&date_type=${searchType}`,
                token
              );
            } else {
              //검색어, 날짜 둘다
              if (selectOpt === "상품명") {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&pname=${searchValue}`,
                  token
                );
              } else if (selectOpt === "주문자") {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&uname=${searchValue}`,
                  token
                );
              } else if (selectOpt === "상품ID") {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&pid=${searchValue}`,
                  token
                );
              } else {
                getSoldOut(
                  `?from_date=${moment(fromDate).format(
                    "YYYYMMDD"
                  )}&to_date=${moment(toDate).format(
                    "YYYYMMDD"
                  )}&date_type=${searchType}&oid=${searchValue}`,
                  token
                );
              }
            }
          }
        }
        break;
      case "clear":
        clearState();
        getSoldOut("", token);
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

  const enableToast = (msg) => {
    setMsgToastToggle(true);
    setMsgToastLog(msg);
    setTimeout(() => {
      setMsgToastToggle(false);
    }, 3000);
    getSoldOut(token);
  };

  const sendMessage = (token) => {
    axios
      .get(`https://sadmin.piclick.kr/soldout/sms?idx=${index}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then((res) => {
        if (res.data !== undefined) {
          if (res.data.results.result_code === "1") {
            setSendModal(false);
            enableToast("메시지를 전송하였습니다.");
            setIndex("");
          } else {
            setSendModal(false);
            enableToast("메시지를 전송하지 못했습니다.");
            setIndex("");
          }
        } else {
          setSendModal(false);
          enableToast("메시지를 전송하지 못했습니다.");
          setIndex("");
        }
      })
      .catch((error) => {
        setSendModal(false);
        enableToast("메시지를 전송하지 못했습니다.");
        setIndex("");
      });
  };

  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  const fields = [
    { key: "order_date", label: "주문일자" },
    { key: "soldout_date", label: "품절일자" },
    { key: "order_id", label: "주문번호" },
    { key: "product_id", label: "상품명" },
    {
      key: "option1",
      label: "옵션1",
      _style: { width: "5%" },
    },
    { key: "option2", label: "옵션2", _style: { width: "5%" } },
    { key: "list_image", label: "이미지", sorter: false, filter: false },
    { key: "qty", label: "수량", _style: { width: "5%" } },
    { key: "price", label: "금액" },
    { key: "user_name", label: "주문자" },
    { key: "phone", label: "주문자 휴대폰" },
    { key: "action", label: "CS상태", _style: { width: "5%" } },
    {
      key: "message",
      label: "",
      sorter: false,
      filter: false,
      _style: { width: "5%" },
    },
  ];

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
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
                <CButton
                  color="primary"
                  name="search"
                  onClick={onSearchClick}
                  style={{ marginRight: "5px" }}
                >
                  검색
                </CButton>
                <CButton color="secondary" name="clear" onClick={onSearchClick}>
                  초기화
                </CButton>
              </CInputGroup>
            </CCol>
          </CFormGroup>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CDataTable
            items={products}
            fields={fields}
            itemsPerPageSelect
            itemsPerPage={10}
            pagination
            sorter
            tableFilter
            columnFilter
            scopedSlots={{
              list_image: (item) => (
                <td>
                  <img src={item.list_image} alt="" width="65px" />
                </td>
              ),
              price: (item) => <td>{numberWithCommas(item.price)}</td>,
              phone: (item) => <td>{numberWithPhone(item.phone)}</td>,
              message: (item) => (
                <td>
                  <CButton
                    color="primary"
                    disabled={item.action !== "품절대상"}
                    onClick={() => sendToggle(item.idx)}
                    id={`button-${item.idx}`}
                  >
                    전송
                  </CButton>
                </td>
              ),
            }}
          ></CDataTable>
        </CCardBody>
      </CCard>
      <CModal show={sendModal} onClose={sendToggle}>
        <CModalHeader>메시지 전송</CModalHeader>
        <CModalBody>메시지를 전송하시겠습니까?</CModalBody>
        <CModalFooter>
          <CButton onClick={sendToggle} color="secondary">
            닫기
          </CButton>
          <CButton
            onClick={() => {
              sendMessage(token);
            }}
            color="primary"
          >
            전송
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster position="top-right">
        <CToast show={msgToastToggle} autohide={3000}>
          <CToastHeader closeButton={false}>메시지 전송</CToastHeader>
          <CToastBody>{msgToastLog}</CToastBody>
        </CToast>
      </CToaster>
    </>
  );
};

export default SoldOutNew;
