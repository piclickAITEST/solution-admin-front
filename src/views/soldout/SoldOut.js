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
    {
      key: "option1",
      label: "옵션1",
      sorter: false,
      _style: {
        width: "5%",
      },
    },
    {
      key: "option2",
      label: "옵션2",
      sorter: false,
      _style: {
        width: "5%",
      },
    },
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

  const previewToggle = (mallID, productNo, orderID) => {
    var url = `https://sol.piclick.kr/soldOut/?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`;
    window.open(
      url,
      "_blank",
      "menubar=no, resizable=no, width=360, height=640"
    );
  };

<<<<<<< HEAD
  const searchValueChange = (event) => {
    const {
      target: { value },
    } = event;

    setSearchValue(value);
  };

  const sendMessage = async (event) => {
    const eventIdx = event.target.value;
    const token = sessionStorage.getItem("userToken");

    const res = await axios.get(
      `https://sadmin.piclick.kr/soldout/sms?idx=${eventIdx}`,
	    {
		    headers: {
			    Authorization: `JWT ${token}`
		    }
	    }
    );
    res.data.results.map((result) => {
      if (result.result_code === "1") {
        const action = document.querySelector(`#action-${eventIdx}`);
        const button = document.querySelector(`#button-${eventIdx}`);

        action.innerText = "메세지전송";
        button.setAttribute("disabled", "");
        return alert("메시지가 전송되었습니다.");
      } else {
        return alert("메시지 전송에 실패하였습니다.");
      }
    });
  };

  if (redirect) {
    return <Redirect from="*" to="/login" />;
  }

  return (
=======
  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
>>>>>>> e933b8b3a31954229a614e0327bf047698be1845
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
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CInputGroup>
            </CCol>
            <CCol>
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
                    >
                      {value[0]}
                    </CButton>
                  ))}
                </CButtonGroup>
                <CButton
                  color="secondary"
                  style={{ marginLeft: "5px" }}
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setDateType("");
                    setSearchType("soldout");
                    getSoldOut("", token);
                  }}
                >
                  검색 필터 초기화
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
<<<<<<< HEAD
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th className="text-center">
                  주문일자
                  <br />
                  품절일자
                </th>
                <th className="text-center">주문번호</th>
                <th className="text-center">상품명</th>
                <th className="text-center">옵션1</th>
                <th className="text-center">옵션2</th>
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
                    <td className="text-center">
                      {option1}
                    </td>
                    <td className="text-center">
                     {option2}
                    </td>
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
                    <td className="text-center action" id={`action-${idx}`}>
                      {action}
                      <br />
                      <CButton
                        onClick={() => {
                          toggleEdit(order_id);
                        }}
                        color="secondary"
                      >
                        상태수정
                      </CButton>
                    </td>
                    <td className="text-center">
                      <CButton
                        onClick={() => {
                          onPreviewClick(product_id, order_id);
                        }}
                      >
                        미리보기
                      </CButton>
                      <CButton
                        color="primary"
                        disabled={action !== "품절대상"}
                        onClick={sendMessage}
                        value={`${idx}`}
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
=======
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
            pagination
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
                  <a href={item.product_url}>
                    <img src={item.list_image} alt="" width="65px" />
                  </a>
                </td>
              ),
              price: (item) => <td>{numberWithCommas(item.price)}</td>,
              phone: (item) => <td>{numberWithPhone(item.phone)}</td>,
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
>>>>>>> e933b8b3a31954229a614e0327bf047698be1845
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
