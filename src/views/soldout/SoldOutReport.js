import { useState, useEffect } from "react";
import axios from "axios";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CFormGroup,
  CInput,
  CInputGroup,
  CLabel,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { Redirect } from "react-router-dom";
import moment from "moment";

const SoldOutReport = () => {
  const token = sessionStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportsPerDay, setReportsPerDay] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateType, setDateType] = useState("일자별 통계");
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState("");
  const reg = /(\d{4})(\d{2})(\d{2})/;

  /* 모달 토글 */
  const modalToggle = (fromDate, toDate, titleDate) => {
    setModal(!modal);
    setDate(titleDate);
    console.log(fromDate, toDate);
    axios({
      method: "get",
      url: `https://sadmin.piclick.kr/soldout/?from_date=${fromDate}&to_date=${toDate}&date_type=soldout&for_stat=T`,
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      if (res.data === undefined || res.data.message === "결과없음") {
        setReportsPerDay([]);
      } else {
        setReportsPerDay(res.data.results);
      }
    });
  };

  const modalToggleClear = () => {
    setModal(!modal);
    setReportsPerDay([]);
  };

  /* 필터 제작 전 임시 일일 값 */
  const clearState = () => {
    setLoading(true);
    setRedirect(false);
    setReports([]);
    setFromDate("");
    setToDate("");
    setDateType("일자별 통계");
    setModal(false);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberToDate(x) {
    if (x === undefined) return;
    if (x === "합계") return "합계";
    if (reg.test(x))
      return x.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    return x;
  }

  const getReport = (args, token) => {
    setLoading(true);
    if (args === undefined || args === "") {
      args = "";
    }

    axios({
      method: "get",
      url: `https://sadmin.piclick.kr/report/soldout2${args}`,
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        if (res.data === undefined || res.data.message === "결과없음") {
          setReports([]);
        } else {
          setReports(res.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response === undefined) {
          console.log("error: 500");
          return;
        } else {
          if (error.response.status === 401) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
          }
        }
      });
  };

  useEffect(() => {
    setFromDate(moment().subtract(1, "months").format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
  }, []);

  useEffect(() => {
    if (token === null || token === undefined) {
      setRedirect(true);
    }
    getReport(
      `?from_date=${moment()
        .subtract(1, "months")
        .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`,
      token
    );

    return () => clearState();
  }, [token]);

  useEffect(() => {
    const getEveryTimes = setInterval(() => {
      if (dateType === "일자별 통계") {
        getReport(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}`,
          token
        );
      } else if (dateType === "주별 통계") {
        getReport(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&report_type=week`,
          token
        );
      } else {
        getReport(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&report_type=month`,
          token
        );
      }
    }, 60000 * 10);
    return () => clearInterval(getEveryTimes);
  }, [token, dateType, fromDate, toDate]);

  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  // 요일 확인
  const getDays = (date) => {
    switch (date) {
      case 0: // 일요일
        return "red";
      case 6: // 토요일
        return "blue";
      default:
        // 평일
        return "";
    }
  };

  const fields = [
    { key: "date", label: "날짜" },
    { key: "order_count", label: "주문 건수" },
    { key: "soldout_count", label: "품절 건수" },
    { key: "soldout_rate", label: "품절률" },
    { key: "message_sent_count", label: "문자 발송 수" },
    { key: "user_count", label: "유저 수" },
    { key: "unknown_user_count", label: "비회원 수" },
    { key: "reco_view_count", label: "추천 뷰" },
    { key: "exchange_conv_count", label: "교환전환\n상품 수" },
    { key: "exchange_conv_sum", label: "교환전환\n금액(원)" },
    { key: "save_conv_count", label: "적립전환\n상품 수" },
    { key: "save_conv_sum", label: "적립전환\n금액(원)" },
    // { key: "lazy_save_count", label: "지연 적립 수" },
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
      case "일자별 통계":
        getReport(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}`,
          token
        );
        break;
      case "주별 통계":
        getReport(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&report_type=week`,
          token
        );
        break;
      case "월별 통계":
        getReport(
          `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
            toDate
          ).format("YYYYMMDD")}&report_type=month`,
          token
        );
        break;
      default:
        break;
      // case "오늘":
      //   setFromDate(moment().format("YYYY-MM-DD"));
      //   setToDate(moment().format("YYYY-MM-DD"));
      //   getReport(
      //     `?from_date=${moment().format("YYYYMMDD")}&to_date=${moment().format(
      //       "YYYYMMDD"
      //     )}`,
      //     token
      //   );
      //   break;
      // case "어제":
      //   setFromDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
      //   setToDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
      //   getReport(
      //     `?from_date=${moment()
      //       .subtract(1, "days")
      //       .format("YYYYMMDD")}&to_date=${moment()
      //       .subtract(1, "days")
      //       .format("YYYYMMDD")}`,
      //     token
      //   );
      //   break;
      // case "1주":
      //   setFromDate(moment().subtract(1, "weeks").format("YYYY-MM-DD"));
      //   setToDate(moment().format("YYYY-MM-DD"));
      //   getReport(
      //     `?from_date=${moment()
      //       .subtract(1, "weeks")
      //       .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`,
      //     token
      //   );
      //   break;
      // case "1개월":
      //   setFromDate(moment().subtract(1, "months").format("YYYY-MM-DD"));
      //   setToDate(moment().format("YYYY-MM-DD"));
      //   getReport(
      //     `?from_date=${moment()
      //       .subtract(1, "months")
      //       .format("YYYYMMDD")}&to_date=${moment().format("YYYYMMDD")}`,
      //     token
      //   );
      //   break;
      // default:
      //   break;
    }
  };

  const onChangeDate = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "fromDate") {
      setFromDate(value);
      if (toDate !== "") {
        if (dateType === "일자별 통계") {
          getReport(
            `?from_date=${moment(value).format("YYYYMMDD")}&to_date=${moment(
              toDate
            ).format("YYYYMMDD")}`,
            token
          );
        } else if (dateType === "주별 통계") {
          getReport(
            `?from_date=${moment(value).format("YYYYMMDD")}&to_date=${moment(
              toDate
            ).format("YYYYMMDD")}&report_type=week`,
            token
          );
        } else {
          getReport(
            `?from_date=${moment(value).format("YYYYMMDD")}&to_date=${moment(
              toDate
            ).format("YYYYMMDD")}&report_type=month`,
            token
          );
        }
      }
    } else if (name === "toDate") {
      setToDate(value);
      if (fromDate !== "") {
        if (dateType === "일자별 통계") {
          getReport(
            `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
              value
            ).format("YYYYMMDD")}`,
            token
          );
        } else if (dateType === "주별 통계") {
          getReport(
            `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
              value
            ).format("YYYYMMDD")}&report_type=week`,
            token
          );
        } else {
          getReport(
            `?from_date=${moment(fromDate).format("YYYYMMDD")}&to_date=${moment(
              value
            ).format("YYYYMMDD")}&report_type=month`,
            token
          );
        }
      }
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
            <CCol sm="12" lg="auto" style={{ marginTop: "5px" }}>
              <CLabel>날짜 선택범위</CLabel>
              <CInputGroup>
                <CButtonGroup>
                  {/* {["오늘", "어제", "1주", "1개월"].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      onClick={changeDateType}
                      active={value === dateType}
                      size="sm"
                    >
                      {value}
                    </CButton>
                  ))} */}
                  {["일자별 통계", "주별 통계", "월별 통계"].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      onClick={changeDateType}
                      active={value === dateType}
                      size="sm"
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
                {/* <CButton
                  color="secondary"
                  style={{ marginLeft: "5px" }}
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setDateType("");
                    getReport("", token);
                  }}
                  size="sm"
                >
                  날짜선택 초기화
                </CButton> */}
                <CButton
                  color="secondary"
                  style={{ marginLeft: "5px" }}
                  onClick={() => {
                    setFromDate(
                      moment().subtract(1, "months").format("YYYY-MM-DD")
                    );
                    setToDate(moment().format("YYYY-MM-DD"));
                    setDateType("일자별 통계");
                    getReport(
                      `?from_date=${moment(fromDate).format(
                        "YYYYMMDD"
                      )}&to_date=${moment(toDate).format("YYYYMMDD")}`,
                      token
                    );
                  }}
                  size="sm"
                >
                  날짜선택 초기화
                </CButton>
              </CInputGroup>
            </CCol>
          </CFormGroup>
          <h6 style={{ color: "#999", textAlign: "right", fontSize: "12px" }}>
            품절 데이터는 10분마다 업데이트됩니다.
          </h6>
        </CCardBody>
      </CCard>
      <CCard>
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
              date: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {numberToDate(item.date)}
                </td>
              ),
              order_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.order_count)}
                </td>
              ),
              soldout_count: (item, idx) => (
                <td
                  onClick={() => {
                    if (idx === 0) {
                      modalToggle(
                        fromDate.split("-").join(""),
                        toDate.split("-").join(""),
                        "전체"
                      );
                    } else {
                      if (dateType === "일자별 통계") {
                        modalToggle(item.date, item.date, item.date);
                      } else {
                        modalToggle(item.start_date, item.end_date, item.date);
                      }
                    }
                  }}
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    cursor: "pointer",
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.soldout_count)}
                </td>
              ),
              soldout_rate: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToRate(item.soldout_rate)}
                </td>
              ),
              message_sent_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.message_sent_count)}
                </td>
              ),
              user_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.user_count)}
                </td>
              ),
              unknown_user_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.unknown_user_count)}
                </td>
              ),
              reco_view_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.reco_view_count)}
                </td>
              ),
              exchange_conv_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.exchange_conv_count)}
                </td>
              ),
              exchange_conv_sum: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.exchange_conv_sum)}
                </td>
              ),
              save_conv_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.save_conv_count)}
                </td>
              ),
              save_conv_sum: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.save_conv_sum)}
                </td>
              ),
              // lazy_save_count: (item, idx) => (
              //   <td
              //     style={{
              //       color: getDays(
              //         moment(
              //           item.date === "합계" ? "" : numberToDate(item.date)
              //         ).day()
              //       ),
              //       background: idx === 0 ? "#e4e4e4" : "",
              //     }}
              //   >
              //     {changeToComma(item.lazy_save_count)}
              //   </td>
              // ),
              // lazy_save_sum: (item, idx) => (
              //   <td
              //     style={{
              //       color: getDays(
              //         moment(
              //           item.date === "합계" ? "" : numberToDate(item.date)
              //         ).day()
              //       ),
              //       background: idx === 0 ? "#e4e4e4" : "",
              //     }}
              //   >
              //     {changeToComma(item.lazy_save_sum)}
              //   </td>
              // ),
              refund_count: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.refund_count)}
                </td>
              ),
              refund_sum: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToComma(item.refund_sum)}
                </td>
              ),
              exchange_conv_rate: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToRate(item.exchange_conv_rate)}
                </td>
              ),
              save_conv_rate: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToRate(item.save_conv_rate)}
                </td>
              ),
              refund_rate: (item, idx) => (
                <td
                  style={{
                    color: getDays(
                      moment(
                        reg.test(item.date) ? numberToDate(item.date) : ""
                      ).day()
                    ),
                    background: idx === 0 ? "#e4e4e4" : "",
                  }}
                >
                  {changeToRate(item.refund_rate)}
                </td>
              ),
            }}
          />
        </CCardBody>
      </CCard>
      {modal ? (
        <CModal show={modal} onClose={modalToggleClear}>
          <CModalHeader>{numberToDate(date)} 품절 상품</CModalHeader>
          <CModalBody style={{ overflowY: "scroll", maxHeight: "600px" }}>
            {reportsPerDay.length > 0
              ? reportsPerDay.map((data) => {
                  return (
                    <div
                      key={data.idx}
                      style={{
                        display: "flex",

                        alignItems: "center",
                        width: "100%",
                        minHeight: "90px",
                        position: "relative",
                        marginBottom: "20px",
                        boxShadow:
                          "0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12)",
                        padding: "10px",
                      }}
                    >
                      <img
                        src={data.list_image}
                        alt={data.idx}
                        style={{
                          width: "30%",
                          height: "auto",
                        }}
                      />
                      <div
                        className="product-infos"
                        style={{
                          width: "100%",
                          paddingLeft: "10px",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <div className="product-info">
                          <div
                            id="product_name"
                            style={{
                              fontWeight: 600,
                              fontSize: "14px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>{data.product_name}</p>
                            <p>
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#508bed",
                                }}
                              >
                                {data.count}
                              </span>
                              개
                            </p>
                          </div>
                          <div
                            id="product_price"
                            style={{
                              fontWeight: 600,
                              fontSize: "16px",
                              color: "#508bed",
                            }}
                          >
                            {numberWithCommas(data.price)}
                            <span style={{ fontSize: "12px", color: "black" }}>
                              원
                            </span>
                          </div>
                          <div id="product_option" style={{ fontSize: "12px" }}>
                            {data.option1}
                            {data.option2 !== "" ? (
                              <>
                                <br />
                                {data.option2}
                              </>
                            ) : (
                              ""
                            )}
                            {data.option3 !== "" ? (
                              <>
                                <br />
                                {data.option3}
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : "데이터 없음"}
          </CModalBody>
          <CModalFooter>
            <CButton onClick={modalToggleClear}>닫기</CButton>
          </CModalFooter>
        </CModal>
      ) : null}
    </div>
  );
};

export default SoldOutReport;
