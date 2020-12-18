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
              <th className="text-center">날짜</th>
              <th className="text-center">교환수</th>
              <th className="text-center">교환율</th>
              <th className="text-center">교환합계</th>
              <th className="text-center">메시지 발송</th>
              <th className="text-center">주문수</th>
              <th className="text-center">추천 조회수</th>
              <th className="text-center">환불수</th>
              <th className="text-center">환불율</th>
              <th className="text-center">환불 합계</th>
              <th className="text-center">적립수</th>
              <th className="text-center">적립율</th>
              <th className="text-center">적립합계</th>
              <th className="text-center">지연 적립수</th>
              <th className="text-center">지연 적립합계</th>
              <th className="text-center">품절수</th>
              <th className="text-center">품절율</th>
              <th className="text-center">비회원</th>
              <th className="text-center">회원</th>
            </tr>
          </thead>
          <tbody>
            {/* toDo : 반복문과  spread operator 등으로 코드 단축*/}
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

              return (
                <tr key={date}>
                  <td className="text-center">{numberToDate(date)}</td>
                  <td className="text-center">
                    {exchange_conv_count !== null
                      ? numberWithCommas(exchange_conv_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {exchange_conv_rate !== null
                      ? `${exchange_conv_rate}%`
                      : "0%"}
                  </td>
                  <td className="text-center">
                    {exchange_conv_sum !== null
                      ? numberWithCommas(exchange_conv_sum)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {message_sent_count !== null
                      ? numberWithCommas(message_sent_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {order_count !== null ? numberWithCommas(order_count) : "0"}
                  </td>
                  <td className="text-center">
                    {reco_view_count !== null
                      ? numberWithCommas(reco_view_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {refund_count !== null
                      ? numberWithCommas(refund_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {refund_rate !== null ? `${refund_rate}%` : "0%"}
                  </td>
                  <td className="text-center">
                    {refund_sum !== null ? numberWithCommas(refund_sum) : "0"}
                  </td>
                  <td className="text-center">
                    {save_conv_count !== null
                      ? numberWithCommas(save_conv_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {save_conv_rate !== null ? `${save_conv_rate}%` : "0%"}
                  </td>
                  <td className="text-center">
                    {save_conv_sum !== null
                      ? numberWithCommas(save_conv_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {lazy_save_count !== null
                      ? numberWithCommas(lazy_save_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {lazy_save_sum !== null
                      ? numberWithCommas(lazy_save_sum)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {soldout_count !== null
                      ? numberWithCommas(soldout_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {soldout_rate !== null ? `${soldout_rate}%` : "0%"}
                  </td>
                  <td className="text-center">
                    {unknown_user_count !== null
                      ? numberWithCommas(unknown_user_count)
                      : "0"}
                  </td>
                  <td className="text-center">
                    {user_count !== null ? numberWithCommas(user_count) : "0"}
                  </td>
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
