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
  CLabel,
  CInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

function SoldOutDetail({ match, location }) {
  // const index = match.params.idx;
  // const orderNo = match.params.order_no;
  const index = match.params.idx;
  const productInfo = location.productInfo;
  const mallID = productInfo.mall_id;
  const productNo = productInfo.product_no;
  const orderID = productInfo.order_id;
  const productPrice = productInfo.price;
  const paymentMethod = productInfo.payment_method;
  // const [detail, setDetail] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [csStatus, setCsStatus] = useState("R");
  const [bankList, setBankList] = useState([]);
  const [bankCode, setBankCode] = useState("002");
  const [bankAccount, setBankAccount] = useState("");
  const [countryCode, setCountryCode] = useState("");

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

  const clearState = () => {
    setRedirect(false);
    setCsStatus("R");
    setBankList([]);
    setBankCode("002");
    setBankAccount("");
    setCountryCode("");
  };

  const getbankList = async () => {
    const token = sessionStorage.getItem("userToken");
    if (token === null || undefined) {
      setRedirect(true);
      return;
    }
    await axios({
      method: "get",
      url: "https://sadmin.piclick.kr/soldout/banks",
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      setBankList(res.data);
    });
  };

  useEffect(() => {
    getbankList();
    return () => clearState();
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

  const postCsStatus = async () => {
    const token = sessionStorage.getItem("userToken");
    if (csStatus === "S") {
      // 적립(Save)
      axios({
        method: "get",
        url: `https://sol.piclick.kr/soldOut/saveOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
      }).then((res) => {
        if (res.data !== undefined || res.data !== null) {
          const requestParam = {
            action_code: csStatus,
            price: productPrice,
            idx: index,
            // mall_id: mallID,
            // order_id: orderID,
            // product_id: productNo,
            status_msg: res.data.res.message,
            status_code: res.data.res.code,
          };
          //적립 상태변화, 로그 API 전송
          axios({
            method: "post",
            url: `https://sadmin.piclick.kr/soldout/action`,
            headers: {
              Authorization: `JWT ${token}`,
            },
            data: requestParam,
          });
        }
      });
    } else if (csStatus === "R") {
      // 환불 (Refund)
      axios({
        method: "get",
        url: `https://sol.piclick.kr/soldOut/refundOrder?mallID=${mallID}&product_no=${productNo}&order_id=${orderID}`,
      }).then((res) => {
        if (res.data !== undefined || res.data !== null) {
          const requestParam = {
            action_code: csStatus,
            price: productPrice,
            idx: index,
            // mall_id: mallID,
            // order_id: orderID,
            // product_id: productNo,
            status_msg: res.data.res.message,
            status_code: res.data.res.code,
          };
          //환불 상태변화, 로그 API 전송
          axios({
            method: "post",
            url: `https://sadmin.piclick.kr/soldout/action`,
            headers: {
              Authorization: `JWT ${token}`,
            },
            data: requestParam,
          });
        }
      });
    }
  };

  const onInputChange = (event) => {
    const {
      target: { value, name },
    } = event;

    if (name === "bankAccount") {
      setBankAccount(value);
    } else {
      setCountryCode(value);
    }
  };

  const bankCodeOnChange = (event) => {
    const {
      target: { value },
    } = event;

    setBankCode(value);
  };

  const onBankSubmit = (event) => {
    const bankObject = {
      bank_account: bankAccount,
      bank_code: bankCode,
      country_code: countryCode,
    };

    if (bankAccount === "" || bankCode === "" || countryCode === "") {
      return;
    } else {
      console.log(bankObject);
    }
  };
  const previewToggle = () => {
    var url = `https://sol.piclick.kr/soldOut/?mallID=rlackdals1&product_no=${productNo}&order_id=${orderID}`;
    window.open(
      url,
      "_blank",
      "menubar=no, resizable=no, width=360, height=640"
    );
  }

  return (
    <div>
      <CCard>
        <CCardHeader>
          <Link to="/soldout">
            <CButton>
              <CIcon name="cil-chevron-left" size="lg" />
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CFormGroup row>
            <CCol xs="2">
              <CLabel>CS 상태</CLabel>
              <CInputGroup>
                <CSelect onChange={csSelectChange} value={csStatus}>
                  <option value="R">환불</option>
                  <option value="S">적립</option>
                  <option value="E">교환</option>
                  <option value="X">처리완료</option>
                </CSelect>
                <CButton color="primary" onClick={postCsStatus}>
                  변경
                </CButton>
              </CInputGroup>
            </CCol>
            {paymentMethod === "cash" && csStatus === "R" ? (
              <>
                <CCol xs="2">
                  <CLabel>은행명</CLabel>
                  <CInputGroup>
                    <CSelect value={bankCode} onChange={bankCodeOnChange}>
                      {bankList &&
                        bankList.map((bank) => {
                          return (
                            <option value={bank.code} key={bank.code}>
                              {bank.name}
                            </option>
                          );
                        })}
                    </CSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="2">
                  <CLabel>계좌 번호</CLabel>
                  <CInput
                    name="bankAccount"
                    value={bankAccount}
                    onChange={onInputChange}
                    placeholder="계좌번호"
                    type="number"
                  />
                </CCol>
                <CCol xs="2">
                  <CLabel>주민번호 앞자리</CLabel>
                  <CInputGroup>
                    <CInput
                      name="countryCode"
                      value={countryCode}
                      onChange={onInputChange}
                      placeholder="주민번호 앞자리"
                      type="number"
                    />
                    <CButton color="primary" onClick={onBankSubmit}>
                      추가
                    </CButton>
                  </CInputGroup>
                </CCol>
              </>
            ) : null}
            <CCol>
              <CButton onClick={previewToggle}>현재 선택된 상품 탬플릿 보기</CButton>
            </CCol>
          </CFormGroup>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <table className="table table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th className="text-center">
                  주문일자
                  <br />
                  품절일자
                </th>
                <th className="text-center">주문번호</th>
                <th className="text-center">상품명</th>
                <th className="text-center">옵션 1</th>
                <th className="text-center">옵션 2</th>
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
