import { useState, useEffect } from "react";
import axios from "axios";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CInput,
  CInputGroup,
  CLabel,
  CSpinner,
} from "@coreui/react";
import { Redirect } from "react-router-dom";
import moment from "moment";

const SoldOutReport = () => {
  const token = sessionStorage.getItem("userToken");
  const [loading, setLoadig] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateType, setDateType] = useState("");

  /* 필터 제작 전 임시 일일 값 */

  const cleearState = () => {
    setLoadig(true);
    setRedirect(false);
    setReports([]);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getReport = (args, token) => {
    if (args === undefined || args === "") {
      args = "";
    }

    axios({
      method: "get",
      url: `https://sadmin.piclick.kr/report/soldout${args}`,
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        setLoadig(false);
        if (res.data === undefined || res.data === null) {
          setReports([]);
          return;
        } else {
          setReports(res.data);
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          console.log("error: 500");
          return;
        } else {
          if (error.response.status) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
          }
        }
      });
  };

  useEffect(() => {
    if (token === null || token === undefined) {
      setRedirect(true);
    }
    getReport("", token);
    const getEveryTimes = setInterval(() => {
      getReport("", token);
    }, 60000 * 10);

    return () => {
      clearInterval(getEveryTimes);
      cleearState();
    };
  }, [token]);

  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  const fields = [
    { key: "date", label: "날짜" },
    { key: "order_count", label: "주문 건수" },
    { key: "soldout_count", label: "품절 건수" },
    { key: "soldout_rate", label: "품절률" },
    { key: "message_sent_count", label: "문자 발송 수" },
    { key: "user_count", label: "유저 수" },
    { key: "unknown_user_count", label: "비회원 수" },
    { key: "reco_view_count", label: "추천 뷰" },
    { key: "exchange_conv_count", label: "교환전환 상품 수" },
    { key: "exchange_conv_sum", label: "교환전환 금액(원)" },
    { key: "save_conv_count", label: "적립전환 상품 수" },
    { key: "save_conv_sum", label: "적립전환 금액(원)" },
    { key: "lazy_save_count", label: "지연 적립 수" },
    { key: "refund_count", label: "환불 상품수" },
    { key: "refund_sum", label: "환불 금액" },
    { key: "exchange_conv_rate", label: "교환 전환율" },
    { key: "save_conv_rate", label: "적립 전환율" },
    { key: "refund_rate", label: "환불 전환율" },
  ];

  const changeToComma = (arg) => {
    return arg !== null ? numberWithCommas(arg) : "0";
  };

  const changeToRate = (arg) => {
    return arg !== null ? `${arg}%` : "0%";
  };

  const changeDateType = (event) => {
    event.persist();
    setDateType(event.target.innerText);
    switch (event.target.innerText) {
      case "오늘":
        setFromDate(moment().format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getReport(
          `?from_date=${moment().format("YYYYMMDD")}&to_date=${moment().format(
            "YYYYMMDD"
          )}`,
          token
        );
        break;
      case "어제":
        setFromDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        setToDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
        getReport(
          `?from_date=${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}&to_date=${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}`,
          token
        );
        break;
      case "1주":
        setFromDate(moment().subtract(1, "weeks").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getReport(
          `?from_date=${moment()
            .subtract(1, "weeks")
            .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`,
          token
        );
        break;
      case "1개월":
        setFromDate(moment().subtract(1, "months").format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
        getReport(
          `?from_date=${moment()
            .subtract(1, "months")
            .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`,
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
    }
  };

  const onChangeDate = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "fromDate") {
      setFromDate(value);
    } else if (name === "toDate") {
      setToDate(value);
    }
  };

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <div>
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
            <CCol>
              <CLabel>날짜 선택범위</CLabel>
              <CInputGroup>
                <CButtonGroup>
                  {["오늘", "어제", "1주", "1개월"].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      onClick={changeDateType}
                      active={value === dateType}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CInputGroup>
            </CCol>
          </CFormGroup>
          <h6 style={{ color: "#d8dbe0", textAlign: "right" }}>
            해당 테이블은 10분마다 갱신됩니다.
          </h6>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>통계(월간)</CCardHeader>
        <CCardBody>
          <CDataTable
            items={reports}
            fields={fields}
            noItemsView={{
              noResults: "검색결과가 없습니다",
              noItems: "데이터가 존재하지 않습니다.",
            }}
            outlined
            responsive
            scopedSlots={{
              order_count: (item) => <td>{changeToComma(item.order_count)}</td>,
              soldout_count: (item) => (
                <td>{changeToComma(item.soldout_count)}</td>
              ),
              soldout_rate: (item) => (
                <td>{changeToRate(item.soldout_rate)}</td>
              ),
              message_sent_count: (item) => (
                <td>{changeToComma(item.message_sent_count)}</td>
              ),
              user_count: (item) => <td>{changeToComma(item.user_count)}</td>,
              unknown_user_count: (item) => (
                <td>{changeToComma(item.unknown_user_count)}</td>
              ),
              reco_view_count: (item) => (
                <td>{changeToComma(item.reco_view_count)}</td>
              ),
              exchange_conv_count: (item) => (
                <td>{changeToComma(item.exchange_conv_count)}</td>
              ),
              exchange_conv_sum: (item) => (
                <td>{changeToComma(item.exchange_conv_sum)}</td>
              ),
              save_conv_count: (item) => (
                <td>{changeToComma(item.save_conv_count)}</td>
              ),
              save_conv_sum: (item) => (
                <td>{changeToComma(item.save_conv_sum)}</td>
              ),
              lazy_save_count: (item) => (
                <td>{changeToComma(item.lazy_save_count)}</td>
              ),
              lazy_save_sum: (item) => (
                <td>{changeToComma(item.lazy_save_sum)}</td>
              ),
              refund_count: (item) => (
                <td>{changeToComma(item.refund_count)}</td>
              ),
              refund_sum: (item) => <td>{changeToComma(item.refund_sum)}</td>,
              exchange_conv_rate: (item) => (
                <td>{changeToRate(item.exchange_conv_rate)}</td>
              ),
              save_conv_rate: (item) => (
                <td>{changeToRate(item.save_conv_rate)}</td>
              ),
              refund_rate: (item) => <td>{changeToRate(item.refund_rate)}</td>,
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default SoldOutReport;
