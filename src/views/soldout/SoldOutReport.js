import { useState, useEffect } from "react";
import axios from "axios";
import { CCard, CCardBody, CCardHeader, CSpinner } from "@coreui/react";
import { Redirect } from "react-router-dom";

const SoldOutReport = () => {
  const token = sessionStorage.getItem("userToken");
  const [loading, setLoadig] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [reports, setReports] = useState([]);

  /* 필터 제작 전 임시 일일 값 */

  const clear = () => {
    setLoadig(true);
    setRedirect(false);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function numberToDate(x) {
    return x.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }

  const getReport = (token) => {
    axios({
      method: "get",
      url: "https://sadmin.piclick.kr/report/soldout",
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
          // console.log(res.data[0]);
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
    getReport(token);
    const getEveryTimes = setInterval(() => {
      getReport(token);
    }, 60000 * 10);

    return () => {
      clearInterval(getEveryTimes);
      clear();
    };
  }, [token]);

  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <CCard>
      <CCardHeader>통계(월간)</CCardHeader>
      <CCardBody>
        <table className="table table-outline mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th>날짜</th>
              <th>주문 건수</th>
              <th>품절 건수</th>
              <th>품절률</th>
              <th>문자 발송수</th>
              <th>유저 수</th>
              <th>비회원 수</th>
              <th>추천 뷰</th>
              <th>교환전환 상품수</th>
              <th>교환전환 금액(원)</th>
              <th>적립전환 상품수</th>
              <th>적립전환 금액(원)</th>
              <th>지연 적립건수</th>
              <th>지연 적립금액(원)</th>
              <th>환불 상품수</th>
              <th>환불 금액</th>
              <th>교환 전환율</th>
              <th>적립 전환율</th>
              <th>환불율</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const {
                date,
                exchange_conv_count,
                exchange_conv_rate,
                exchange_conv_sum,
                message_sent_count,
                order_count,
                reco_view_count,
                refund_count,
                refund_rate,
                refund_sum,
                save_conv_count,
                save_conv_rate,
                save_conv_sum,
                soldout_count,
                soldout_rate,
                unknown_user_count,
                user_count,
                lazy_save_count,
                lazy_save_sum,
              } = report;

              const changeToComma = (arg) => {
                return arg !== null ? numberWithCommas(arg) : "0";
              };

              const changeToPercent = (arg) => {
                return arg !== null ? `${arg}%` : "0%";
              };

              return (
                <tr key={date}>
                  <td>{numberToDate(date)}</td>
                  <td>{changeToComma(order_count)}</td>
                  <td>{changeToComma(soldout_count)}</td>
                  <td>{changeToPercent(soldout_rate)}</td>
                  <td>{changeToComma(message_sent_count)}</td>
                  <td>{changeToComma(user_count)}</td>
                  <td>{changeToComma(unknown_user_count)}</td>
                  <td>{changeToComma(reco_view_count)}</td>
                  <td>{changeToComma(exchange_conv_count)}</td>
                  <td>{changeToComma(exchange_conv_sum)}</td>
                  <td>{changeToComma(save_conv_count)}</td>
                  <td>{changeToComma(save_conv_sum)}</td>
                  <td>{changeToComma(lazy_save_count)}</td>
                  <td>{changeToComma(lazy_save_sum)}</td>
                  <td>{changeToComma(refund_count)}</td>
                  <td>{changeToComma(refund_sum)}</td>
                  <td>{changeToPercent(exchange_conv_rate)}</td>
                  <td>{changeToPercent(save_conv_rate)}</td>
                  <td>{changeToPercent(refund_rate)}</td>
                </tr>
              );
            })}
            <tr></tr>
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  );
};

export default SoldOutReport;
