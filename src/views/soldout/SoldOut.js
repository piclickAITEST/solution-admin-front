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
} from "@coreui/react";
import { Redirect } from "react-router-dom";

const token = sessionStorage.getItem("userToken");

const SoldOut = () => {
  const [products, setProducts] = useState([]);
  const [dateType, setDateType] = useState("");
  const [searchType, setSearchType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectOpt, setSelectOpt] = useState("상품명");
  const [searchValue, setSearchValue] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editOrderID, setEditOrderID] = useState("");
  const [csStatus, setCsStatus] = useState("환불");

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberWithPhone(x) {
    return x.toString().replace(/(\d{2,3})(\d{3,4})(\d{3,4})/, "$1-$2-$3");
  }

  const toggleEdit = (order_id) => {
    setEditModal(!editModal);
    setEditOrderID(order_id);
  };

  const getSoldOut = async (args) => {
    if (args === undefined) {
      args = "";
    }
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }
    const res = await axios.get(`https://sadmin.piclick.kr/soldout/${args}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    if (res.data.results === undefined) {
      setProducts([]);
    } else {
      setProducts(res.data.results);
    }
  };

  const cleanUp = () => {
    setProducts([]);
    setDateType("");
    setSearchType("");
    setFromDate("");
    setToDate("");
    setSelectOpt("상품명");
    setSearchValue("");
  };

  useEffect(() => {
    getSoldOut();

    return () => cleanUp;
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

  const changeCSStatus = (event) => {
    const {
      target: { value },
    } = event;
    setCsStatus(value);
  };

  const postCsStatus = async () => {
    const res = await axios({
      method: "post",
      url: "https://sadmin.piclick.kr/soldout/action",
      headers: {
        Authorization: `JWT ${token}`,
      },
      data: {
        order_id: editOrderID,
        action_code: csStatus,
      },
    });
    if (res.data.results === undefined) {
      getSoldOut();
      toggleEdit("");
    } else {
      getSoldOut();
      toggleEdit("");
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

  const onPreviewClick = (product_no, order_id) => {
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

  const sendMessage = async (event) => {
    const eventIdx = event.target.value;

    const res = await axios.get(
      `https://sadmin.piclick.kr/soldout/sms?idx=${eventIdx}`
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
    return <Redirect to="/login" />;
  }

  return (
    <>
      <CCard>
        <CCardBody>
          <CFormGroup row>
            <CCol xs="3">
              <CInputGroup>
                <CInput
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  placeholder="시작일"
                  value={fromDate}
                  onChange={onChangeDate}
                />
                <CInput
                  type="date"
                  id="toDate"
                  name="toDate"
                  placeholder="종료일"
                  value={toDate}
                  onChange={onChangeDate}
                />
              </CInputGroup>
            </CCol>
            <CCol xs="2">
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
            </CCol>
            <CCol xs="3">
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
              <CButton color="primary" name="search" onClick={onSearchClick}>
                검색
              </CButton>
              <CButton name="clear" onClick={onSearchClick}>
                초기화
              </CButton>
            </CCol>
          </CFormGroup>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th className="text-center">
                  주문일자
                  <br />
                  품절일자
                </th>
                <th className="text-center">판매처</th>
                <th className="text-center">주문번호</th>
                <th className="text-center">상품명</th>
                <th className="text-center">컬러</th>
                <th className="text-center">사이즈</th>
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
                  bizName,
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
                    <td className="text-center">{bizName}</td>
                    <td className="text-center">{order_id}</td>
                    <td className="text-center">{product_name}</td>
                    <td className="text-center">
                      {option1 === "" ? "없음" : option1}
                    </td>
                    <td className="text-center">
                      {option2 === "" ? "없음" : option2}
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
        </CCardBody>
      </CCard>
      <CModal show={editModal} name="edit">
        <CModalHeader closeButton>CS상태 수정</CModalHeader>
        <CModalBody>
          <CSelect onChange={changeCSStatus} value={csStatus}>
            <option value="R">환불</option>
            <option value="S">적립</option>
            <option value="E">교환</option>
            <option value="X">처리완료</option>
          </CSelect>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              toggleEdit("");
            }}
          >
            닫기
          </CButton>
          <CButton color="primary" onClick={postCsStatus}>
            상태수정
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default SoldOut;
