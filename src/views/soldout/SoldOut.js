// 새로운 품절대체 페이지입니다.
// 새로운 품절대체 페이지입니다.
// 새로운 품절대체 페이지입니다.
// 새로운 품절대체 페이지입니다.

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
import { Link, Redirect } from "react-router-dom";

const SoldOut = () => {
  const token = sessionStorage.getItem("userToken");
  const [products, setProducts] = useState([]);
  const [dateType, setDateType] = useState("");
  const [searchType, setSearchType] = useState("soldout");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
      url: `/soldout/${args}`,
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
    setSearchType("soldout");
    setFromDate("");
    setToDate("");
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

  const changeDateType = (event) => {
    event.persist();
    setDateType(event.target.innerText);
    switch (event.target.innerText) {
      case "오늘":
        setFromDate(moment().format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getSoldOut(
          `?from_date=${moment().format("YYYYMMDD")}&to_date=${moment().format(
            "YYYYMMDD"
          )}&date_type=${searchType}`,
          token
        );
        break;
      case "어제":
        setFromDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        setToDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        getSoldOut(
          `?from_date=${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}&to_date=${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}&date_type=${searchType}`,
          token
        );
        break;
      case "1주":
        setFromDate(moment().subtract(1, "weeks").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getSoldOut(
          `?from_date=${moment()
            .subtract(1, "weeks")
            .format("YYYYMMDD")}&to_date=${moment().format(
            "YYYYMMDD"
          )}&date_type=${searchType}`,
          token
        );
        break;
      case "1개월":
        setFromDate(moment().subtract(1, "months").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getSoldOut(
          `?from_date=${moment()
            .subtract(1, "months")
            .format("YYYYMMDD")}&to_date=${moment().format(
            "YYYYMMDD"
          )}&date_type=${searchType}`,
          token
        );
        break;
      default:
        break;
    }

    if (dateType === event.target.innerText) {
      setFromDate("");
      setToDate("");
      setDateType("");
      getSoldOut("", token);
    }
  };

  const changeSearchType = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "주문일자":
        setSearchType(value);
        getSoldOut(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&date_type=${value}`,
          token
        );
        break;
      case "품절일자":
        setSearchType(value);
        getSoldOut(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&date_type=${value}`,
          token
        );
        break;
      default:
        break;
    }
  };

  const onChangeDate = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "fromDate") {
      setFromDate(value);
      if (toDate !== "") {
        // 날짜에 따라 선택범위 버튼 자동선택
        if (
          value === moment().format("YYYY-MM-DD") &&
          toDate === moment().format("YYYY-MM-DD")
        ) {
          setDateType("오늘");
        } else if (
          value === moment().subtract(1, "days").format("YYYY-MM-DD") &&
          toDate === moment().subtract(1, "days").format("YYYY-MM-DD")
        ) {
          setDateType("어제");
        } else if (
          value === moment().subtract(1, "weeks").format("YYYY-MM-DD") &&
          toDate === moment().format("YYYY-MM-DD")
        ) {
          setDateType("1주");
        } else if (
          value === moment().subtract(1, "months").format("YYYY-MM-DD") &&
          toDate === moment().format("YYYY-MM-DD")
        ) {
          setDateType("1개월");
        } else {
          setDateType("");
        }

        getSoldOut(
          `?from_date=${moment(value).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&date_type=${searchType}`,
          token
        );
      }
    } else if (name === "toDate") {
      setToDate(value);
      if (fromDate !== "") {
        // 날짜에 따라 선택범위 버튼 자동선택
        if (
          fromDate === moment().format("YYYY-MM-DD") &&
          value === moment().format("YYYY-MM-DD")
        ) {
          setDateType("오늘");
        } else if (
          fromDate === moment().subtract(1, "days").format("YYYY-MM-DD") &&
          value === moment().subtract(1, "days").format("YYYY-MM-DD")
        ) {
          setDateType("어제");
        } else if (
          fromDate === moment().subtract(1, "weeks").format("YYYY-MM-DD") &&
          value === moment().format("YYYY-MM-DD")
        ) {
          setDateType("1주");
        } else if (
          fromDate === moment().subtract(1, "months").format("YYYY-MM-DD") &&
          value === moment().format("YYYY-MM-DD")
        ) {
          setDateType("1개월");
        } else {
          setDateType("");
        }

        getSoldOut(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            value
          ).format("YYYYMMDD")}&date_type=${searchType}`,
          token
        );
      }
    }
  };

  const sendToggle = (idx) => {
    setSendModal(!sendModal);
    setIndex(idx);
  };

  const enableToast = (msg) => {
    setMsgToastToggle(true);
    setMsgToastLog(msg);
    setTimeout(() => {
      setMsgToastToggle(false);
    }, 3000);
    if (fromDate !== "" && toDate !== "") {
      getSoldOut(
        `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
          toDate
        ).format("YYYYMMDD")}&date_type=${searchType}`,
        token
      );
    } else {
      getSoldOut("", token);
    }
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
    {
      key: "order_date",
      label: "주문일자",
      _style: {
        width: "10%",
      },
    },
    {
      key: "soldout_date",
      label: "품절일자",
      _style: {
        width: "10%",
      },
    },
    {
      key: "order_id",
      label: "주문번호",
      sorter: false,
      _style: {
        width: "10%",
      },
    },
    { key: "product_name", label: "상품명", sorter: false },
    // { key: "option1", label: "옵션1", sorter: false },
    // { key: "option2", label: "옵션2", sorter: false },
    // { key: "option3", label: "옵션3", sorter: false },
    { key: "option", label: "옵션", sorter: false },
    { key: "list_image", label: "이미지", sorter: false, filter: false },
    {
      key: "qty",
      label: "수량",
      _style: {
        width: "4%",
      },
      sorter: false,
    },
    { key: "price", label: "금액", sorter: false },
    { key: "user_name", label: "주문자", sorter: false },
    { key: "phone", label: "주문자 휴대폰", sorter: false },
    { key: "action", label: "CS상태", sorter: false },
    {
      key: "detail",
      label: "",
      sorter: false,
      filter: false,
      _style: {
        width: "5%",
      },
    },
    {
      key: "message",
      label: "",
      sorter: false,
      filter: false,
      _style: {
        width: "4%",
      },
    },
  ];

  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setDateType("");
    setSearchType("soldout");
    getSoldOut("", token);
  };

  const previewToggle = (mallID, productNo, orderID) => {
    var url = `https://sol.piclick.kr/soldOut/?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}&is_admin=True`;
    window.open(
      url,
      "_blank",
      "menubar=no, resizable=no, width=360, height=640"
    );
  };

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <>
      <CCard>
        <CCardBody>
          <CFormGroup row>
            <CCol sm="12" lg="auto" style={{ marginTop: "5px" }}>
              <CLabel>시작일/종료일</CLabel>
              <CInputGroup>
                <CInput
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={fromDate}
                  onChange={onChangeDate}
                  size="sm"
                />
                <CInput
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={toDate}
                  onChange={onChangeDate}
                  size="sm"
                />
              </CInputGroup>
            </CCol>
            <CCol sm="auto" style={{ marginTop: "5px" }}>
              <CLabel>날짜 선택범위</CLabel>
              <CInputGroup>
                <CButtonGroup>
                  {["오늘", "어제", "1주", "1개월"].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === dateType}
                      onClick={changeDateType}
                      size="sm"
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CInputGroup>
            </CCol>
            <CCol sm="auto" style={{ marginTop: "5px" }}>
              <CLabel>날짜 선택기준</CLabel>
              <CInputGroup>
                <CButtonGroup>
                  {[
                    ["품절일자", "soldout"],
                    ["주문일자", "order"],
                  ].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value[1]}
                      name={value[0]}
                      className="mx-0"
                      active={value[1] === searchType}
                      value={value[1]}
                      onClick={changeSearchType}
                      size="sm"
                    >
                      {value[0]}
                    </CButton>
                  ))}
                </CButtonGroup>
                <CButton
                  color="secondary"
                  style={{ marginLeft: "5px" }}
                  onClick={resetFilter}
                  size="sm"
                >
                  날짜선택 초기화
                </CButton>
              </CInputGroup>
            </CCol>
          </CFormGroup>
          <h6 style={{ color: "#999", textAlign: "right", fontSize: "12px" }}>
            품절 데이터는 10분마다 업데이트됩니다.
            <br />
            주문번호 클릭 시 해당 상품의 상세 페이지로 접근합니다.
          </h6>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CDataTable
            items={products}
            fields={fields}
            itemsPerPageSelect={{
              label: "표시 할 갯수",
            }}
            itemsPerPage={10}
            noItemsView={{
              noResults: "검색결과가 없습니다",
              noItems: "데이터가 존재하지 않습니다.",
            }}
            pagination={{
              size: "sm",
            }}
            sorter
            tableFilter={{
              label: "검색",
              placeholder: "검색어 입력",
            }}
            outlined
            responsive
            hover
            cleaner
            scopedSlots={{
              list_image: (item) => (
                <td>
                  <a href={item.product_url} target="_blank" rel="noreferrer">
                    <img src={item.list_image} alt="" width="65px" />
                  </a>
                </td>
              ),
              price: (item) => <td>{numberWithCommas(item.price)}</td>,
              phone: (item) => <td>{numberWithPhone(item.phone)}</td>,
              option: (item) => (
                <td>
                  {item.option1} <br />
                  {item.option2} <br />
                  {item.option3}
                </td>
              ),
              detail: (item) => (
                <td>
                  <CButton
                    color="secondary"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      previewToggle(
                        item.mall_id,
                        item.product_id,
                        item.order_id
                      );
                    }}
                  >
                    미리보기
                  </CButton>
                </td>
              ),
              action: (item) => (
                <td>
                  {item.action}
                  <br />
                  {item.status_text}
                </td>
              ),
              message: (item) => (
                <td>
                  <CButton
                    color={item.action === "재입고" ? "secondary" : "primary"}
                    shape="square"
                    size="sm"
                    disabled={item.action !== "판매중지"}
                    onClick={() => sendToggle(item.idx)}
                    id={`button-${item.idx}`}
                  >
                    전송
                  </CButton>
                </td>
              ),
              order_id: (item) => (
                <td>
                  <Link
                    to={{
                      pathname: `/soldout/${item.idx}/${item.order_id}`,
                      productInfo: {
                        price: item.price,
                        mall_id: item.mall_id,
                        product_no: item.product_id,
                        order_id: item.order_id,
                        payment_method: item.payment_method,
                        bizName: item.bizName,
                        user_name: item.user_name,
                        product_name: item.product_name,
                        order_date: item.order_date,
                        option1: item.option1,
                        option2: item.option2,
                        qty: item.qty,
                        origin_action: item.action,
                      },
                    }}
                  >
                    {item.order_id}
                  </Link>
                </td>
              ),
            }}
          />
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

export default SoldOut;

// 새로운 품절대체 페이지입니다.
// 새로운 품절대체 페이지입니다.
// 새로운 품절대체 페이지입니다.
// 새로운 품절대체 페이지입니다.
