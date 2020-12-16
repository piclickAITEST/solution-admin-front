import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormGroup,
  CCol,
  CInputGroup,
  CSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

function SoldOutDetail({ match, location }) {
  // const index = match.params.idx;
  const orderNo = match.params.order_no;
  const productInfo = location.productInfo;
  const mallID = productInfo.mall_id;
  const productNo = productInfo.product_no;
  const orderID = productInfo.order_id;
  const productPrice = productInfo.price;
  // const [detail, setDetail] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [csStatus, setCsStatus] = useState("*");

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

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }
  }, []);

  if (redirect) {
    return <Redirect from="*" to="/login" />;
  }

  const csSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    setCsStatus(value);
  };

  // const postCsStatus = async () => {
  //   const token = sessionStorage.getItem("userToken");
  //   const res = await axios({
  //     method: "post",
  //     url: "https://sadmin.piclick.kr/soldout/action",
  //     headers: {
  //       Authorization: `JWT ${token}`,
  //     },
  //     data: {
  //       order_id: editOrderID,
  //       action_code: csStatus,
  //     },
  //   });
  //   if (res.data.results === undefined) {
  //     getSoldOut();
  //     setCsStatus("환불");
  //     // toggleInfo("");
  //   } else {
  //     getSoldOut();
  //     setCsStatus("환불");
  //     // toggleInfo("");
  //   }
  // };

  const postCsStatus = async () => {
    const token = sessionStorage.getItem("userToken");
    const username = sessionStorage.getItem("userName");
    if (csStatus === "*") {
      console.log("선택 기본값은 업로드가 불가능합니다..");
      return;
    }
    const res = axios({
      // 상태 변화 API 전송
      method: "post",
      url: "https://sadmin.piclick.kr/soldout/action",
      headers: {
        Authorization: `JWT ${token}`,
      },
      data: {
        order_id: orderNo,
        action_code: csStatus,
      },
    });
    if (res.data !== undefined || res.data !== null) {
      // API 전송 결과가 undefined가 아닐 경우
      if (csStatus === "S") {
        // 적립로그
        console.log("적립");
      } else if (csStatus === "R") {
        const requestParam = {
          action_code: "CS_ADMIN_REFUND",
          price: productPrice,
          mall_id: mallID,
          order_id: orderID,
          product_id: productNo,
        };

        const res = axios({
          method: "get",
          url: `https://sol.piclick.kr/soldOut/saveOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
        });

        // axios({
        //   url: "https://sadmin.piclick.kr/log/soldout/refund",
        //   type: "POST",
        //   contentType: "application/json",
        //   data: JSON.stringify(requestParam),
        // });
      }
    } else {
      // 변경 실패
    }
  };

  return (
    <div>
      <CCard>
        <CCardHeader>
          <Link to="/soldout">
            <CButton>
              <CIcon name="cil-chevron-left" />
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CCol xs="2">
            <CFormGroup row>
              <CInputGroup>
                <CSelect onChange={csSelectChange} value={csStatus}>
                  <option value="*">CS 상태변경</option>
                  <option value="R">환불</option>
                  <option value="S">적립</option>
                  <option value="E">교환</option>
                  <option value="X">처리완료</option>
                </CSelect>
                <CButton color="primary" onClick={postCsStatus}>
                  변경
                </CButton>
              </CInputGroup>
            </CFormGroup>
            <CFormGroup>
              <iframe
                src={`https://sol.piclick.kr/soldOut/?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`}
                title="shescloset"
                width="320px"
                height="640px"
                style={{ border: "none" }}
              />
            </CFormGroup>
          </CCol>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  2020-12-01 17:23
                  <br />
                  2020-12-05 11:00
                </td>
                <td className="text-center">20201201-0000123</td>
                <td className="text-center">테스트용 상품</td>
                <td className="text-center">핑크</td>
                <td className="text-center">3XL</td>
                <td className="text-center">이미지사진</td>
                <td className="text-center">1</td>
                <td className="text-center">{numberWithCommas(127000)}</td>
                <td className="text-center">
                  이우림
                  <br />
                  이우림
                </td>
                <td className="text-center">
                  {numberWithPhone("01012345678")}
                  <br />
                  {numberWithPhone("02123456")}
                </td>
                <td className="text-center">테스트</td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default SoldOutDetail;
