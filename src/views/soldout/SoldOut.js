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
} from "@coreui/react";

const SoldOut = () => {
  const [products, setProducts] = useState([]);
  const [dateStatus, setDateStatus] = useState("전체");

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
  };

  const sendMessage = (event) => {
    event.persist();
    console.log(event.target.id);
  };

  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol className="d-none d-md-block">
              <CButtonGroup className="float-right mr-3">
                {["전체", "오늘", "어제", "1주", "1개월"].map((value) => (
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
          </CRow>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardBody>
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th className="text-center">
                  <input type="checkbox" name="selectAll" />
                </th>
                <th className="text-center">주문일자</th>
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
                } = product;
                const easyDate = moment(new Date(order_date)).format(
                  "YYYY-MM-DD HH:MM:SS"
                );

                return (
                  <tr key={idx}>
                    <td className="text-center">
                      <input type="checkbox" name={idx}></input>
                    </td>
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
                    <td className="text-center">{action}</td>
                    <td className="text-center">
                      <CButton
                        color="primary"
                        disabled={action !== "품절대상"}
                        onClick={sendMessage}
                        id={idx}
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
