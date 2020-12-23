import { Redirect, Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

// routes config
import routes from "../routes";

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => (
                    <CFade>
                      <route.component {...props} />
                    </CFade>
                  )}
                />
              )
            );
          })}
          <Redirect from="/" to="/soldout" />
        </Switch>
      </CContainer>
    </main>
  );
};

export default TheContent;
