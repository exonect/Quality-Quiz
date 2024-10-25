import React from "react";
import { AppContext } from "./AppContextProvider";

const WithAppContext = (Components) => (props) => {
  return (
    <AppContext.Consumer>
      {(context) => <Components {...props} context={context} />}
    </AppContext.Consumer>
  );
};

export default WithAppContext;
