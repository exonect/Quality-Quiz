import { ThemeProvider } from "@mui/material/styles";
import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLoading from "./Helper/Components/AppLoading";
import { Images } from "./Helper/Assets/images";
import AppContextProvider from "./Helper/Context/AppContextProvider";
import theme from "./theme";

const QuizDashboard = lazy(() => import("./Screen/QuizDashboard"));
const SignIn = lazy(() => import("./Screen/SignIn"));
const NotFound = lazy(() => import("./Screen/NotFound"));
const Home = lazy(() => import("./Screen/Home"));
const Welcome = lazy(() => import("./Screen/Welcome"));

const App = () => {
  // const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isUserLogdin, setIsUserLogdin] = useState(null);

  useEffect(() => {
    const userRoleData = JSON.parse(localStorage.getItem("userRole"));
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (accessToken && userRoleData) {
      setIsUserLogdin(true);
      setUserRole(userRoleData);
      setTimeout(() => {
        setIsAppLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setIsAppLoading(false);
      }, 1500);
      setUserRole(null);
      localStorage.clear();
      setIsUserLogdin(false);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/tbwes-quality-quiz/">
        <AppContextProvider>
          {isAppLoading ? (
            <div className="bg-[#fff] h-[100vh] w-[100vw] flex flex-col justify-center items-center">
              <img
                loading="lazy"
                src={Images.Logo}
                alt="thermax_logo"
                className="w-[100px] h-[auto] mb-[10px]"
              />
              <AppLoading />
            </div>
          ) : (
            <>
              <Suspense
                fallback={
                  <div className="bg-[#fff] h-[100vh] w-[100vw] flex flex-col justify-center items-center">
                    <img
                      loading="lazy"
                      src={Images.Logo}
                      alt="thermax_logo"
                      className="w-[100px] h-[auto] mb-[10px]"
                    />
                    <AppLoading />
                  </div>
                }
              >
                {isUserLogdin === true ? (
                  <div className="flex h-[100vh]">
                    {userRole === "jury" && (
                      <div className="flex w-full">
                        <div
                          style={{
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Routes>
                            <Route path="/dashboard" element={<Home />} />
                            <Route path="/" element={<Welcome />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                      </div>
                    )}
                    {userRole === "participant" && (
                      <div className="flex w-full">
                        <div
                          style={{
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Routes>
                            <Route
                              path="/quiz/dashboard"
                              element={<QuizDashboard />}
                            />
                            <Route path="/" element={<Welcome />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}
              </Suspense>
            </>
          )}
        </AppContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
