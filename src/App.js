import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

function App() {
  // const [isLogin, setIsLogin] = useState(false);

  // const clear = () => {
  //   setIsLogin(false);
  // };
  // const getSession = () => {
  //   const session = sessionStorage.getItem("userToken");

  //   if (session !== null) {
  //     setIsLogin(true);
  //   } else {
  //     setIsLogin(false);
  //   }
  // };

  // useEffect(() => {
  //   getSession();

  //   return () => clear;
  // });

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route
            exact
            path="/login"
            name="Login Page"
            render={(props) => <Login {...props} />}
          />
          <Route
            exact
            path="/404"
            name="Page 404"
            render={(props) => <Page404 {...props} />}
          />
          <Route
            exact
            path="/500"
            name="Page 500"
            render={(props) => <Page500 {...props} />}
          />
          <Route
            path="/"
            name="Home"
            render={(props) => <TheLayout {...props} />}
          />
        </Switch>
        {/* {isLogin ? <Redirect from="login" to="/" /> : <Redirect to="/login" />} */}
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
