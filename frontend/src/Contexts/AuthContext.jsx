import  {useState , useEffect, createContext} from "react";
export const TokenContext = createContext();

const TokenContextProvider = ({children}) => {
    const [token , setToken] = useState(localStorage.getItem("token") || "");
    const [role , setRole] = useState(localStorage.getItem("role")|| "");
    useEffect(()=> {
const storedToken = localStorage.getItem("token");
const storedRole = localStorage.getItem("role");
 if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    } , [])

return (
    <TokenContext.Provider value={{token , setToken , role , setRole}} >
   {children}

    </TokenContext.Provider>
)

}
export default TokenContextProvider;

