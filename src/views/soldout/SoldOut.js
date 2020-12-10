import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CInput,
  CInputGroup,
  CSelect,
} from "@coreui/react";

const SoldOut = () => {
  const [products, setProducts] = useState([]);
  const [dateStatus, setDateStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberWithPhone(x) {
    return x.toString().replace(/(\d{2,3})(\d{3,4})(\d{3,4})/, "$1-$2-$3");
  }

  const getSoldOut = async (args) => {
    if (args === undefined) {
      args = "";
    }
    const res = await axios.get(
      `https://sadmin.piclick.kr/soldout/?au_id=2605${args}`
    );
    setProducts(res.data.results);
  };

  useEffect(() => {
    getSoldOut();

    return () => getSoldOut();
  }, []);

  const changeDateStatus = (event) => {
    event.persist();
    setDateStatus(event.target.innerText);
    switch (event.target.innerText) {
      case "오늘":
        setFromDate(moment().format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getSoldOut(
          `&from_date=${moment().format("YYYYMMDD")}&to_date=${moment().format(
            "YYYYMMDD"
          )}`
        );
        break;
      case "어제":
        setFromDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        setToDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        getSoldOut(
          `&from_date=${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}&to_date=${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}`
        );
        break;
      case "1주":
        setFromDate(moment().subtract(1, "weeks").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getSoldOut(
          `&from_date=${moment()
            .subtract(1, "weeks")
            .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`
        );
        break;
      case "1개월":
        setFromDate(moment().subtract(1, "months").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getSoldOut(
          `&from_date=${moment()
            .subtract(1, "months")
            .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`
        );
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
      } else {
        return console.log("failed");
      }
    });
  };

  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol className="d-none d-md-block">
              <CButtonGroup className="float-left mr-3">
                {["오늘", "어제", "1주", "1개월"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === dateStatus}
                    onClick={changeDateStatus}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
            <CCol className="d-none d-md-block" sm={4}>
              <CInputGroup>
                <CSelect custom name="search-filter" id="search-filter">
                  <option value="1">상품명</option>
                  <option value="2">주문자</option>
                  <option value="3">주문번호</option>
                </CSelect>
                <CInput
                  type="text"
                  id="nf-email"
                  name="nf-email"
                  placeholder="검색"
                />
                <CButton color="primary">검색</CButton>
              </CInputGroup>
            </CCol>
          </CRow>
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
                <th className="text-center">메시지 전송</th>
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
                } = product;
                const easyDate = moment(new Date(order_date)).format(
                  "YYYY-MM-DD HH:MM:SS"
                );

                return (
                  <tr key={idx}>
                    <td className="text-center">{easyDate}</td>
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
                    </td>
                    <td className="text-center">
                      <CButton
                        onClick={() => {
                          onPreviewClick(product_id, order_id);
                        }}
                        color="warning"
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
    </>
  );
};

export default SoldOut;
