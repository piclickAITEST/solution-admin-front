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
  CInput,
  CButtonGroup,
  CSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

function SoldOutDetail({ match }) {
  // const id = match.params.id;
  // const [detail, setDetail] = useState([]);
  // const [redirect, setRedirect] = useState(false);

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

  // const getDetail = async () => {
  //   const token = sessionStorage.getItem("userToken");
  //   if (token === null || undefined) {
  //     setRedirect(true);
  //     return;
  //   }
  //   const res = await axios.get(`https://sadmin.piclick.kr/soldout/`, {
  //     headers: {
  //       Authorization: `JWT ${token}`,
  //     },
  //   });
  //   if (res.data.results === undefined) {
  //     console.log("");
  //   } else {
  //     console.log(res.data.results);
  //   }
  // };

  // useEffect(() => {
  //   getDetail();

  //   return () => getDetail();
  // }, []);

  // if (redirect) {
  //   return <Redirect from="*" to="/login" />;
  // }

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
          <CFormGroup row>
            <CCol xs="3">
              <CInputGroup>
                <CInput
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  placeholder="시작일"
                />
                <CInput
                  type="date"
                  id="toDate"
                  name="toDate"
                  placeholder="종료일"
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
                    // active={value[1] === searchType}
                    // value={value[1]}
                    // onClick={changeSearchType}
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
                    // active={value === dateType}
                    // onClick={changedateType}
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
                  // onChange={onSelectChange}
                  // value={selectOpt}
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
                  // value={searchValue}
                  // onChange={searchValueChange}
                />
              </CInputGroup>
            </CCol>
            <CCol>
              <CButton color="primary" name="search">
                검색
              </CButton>
              <CButton name="clear">초기화</CButton>
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
