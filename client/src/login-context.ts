import React from "react";

const LoginContext = React.createContext({
    isLoggedIn: false,
    setIsLoggedIn: (b: boolean) => {}
});

export default LoginContext