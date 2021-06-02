import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import Parse from "parse";

const Auth = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      const user = await Parse.User.current()
      
      if (user !== null) {
        const authen = user.authenticated();
        // const token = user.getSessionToken();

        setIsAuthenticated(authen);
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
      
    }

    verify();
  }, []);

  return loading ? (
    "Carregando..."
  ) : (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default Auth;
