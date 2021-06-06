import { createContext } from "react";
const AuthContext = createContext([{ Authenticated: false }, () => {}]);
export default AuthContext;
