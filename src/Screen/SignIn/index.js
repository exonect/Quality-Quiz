import { CheckCircle, Quiz, Timer } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginWithSSOApi } from "../../Helper/Api";
import { Images } from "../../Helper/Assets/images";
import Toaster from "../../Helper/Components/Toaster";
import { AppContext } from "../../Helper/Context/AppContextProvider";
import { msalInstance } from "../../msalConfig";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "#000000",
  "&:hover": {
    backgroundColor: "#0e1322",
  },
}));

const SignIn = () => {
  const { apiStore, setApiStore } = useContext(AppContext);
  const [openToaster, setOpenToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const navigate = useNavigate();

  const onLoginWithSSOApi = async (response) => {
    const ssoAPIRes = await LoginWithSSOApi({
      email: response.account.username,
    });
    if (ssoAPIRes.status === 200) {
      localStorage.setItem("isSidebarMove", true);
      showToastMessage("Login Successfully", "success");
      localStorage.setItem(
        "accessToken",
        JSON.stringify(ssoAPIRes?.detail?.access_token)
      );
      localStorage.setItem(
        "userRole",
        JSON.stringify(ssoAPIRes?.detail?.user_type)
      );
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(ssoAPIRes?.detail?.refresh_token)
      );
      localStorage.setItem("userInfo", JSON.stringify(ssoAPIRes.detail));
      setApiStore({ ...apiStore, login: ssoAPIRes.detail });
      if (ssoAPIRes?.detail?.user_type === "participant") {
        navigate("/quiz/dashboard");
      }
      if (ssoAPIRes?.detail?.user_type === "jury") {
        navigate("/dashboard");
      }
      window.location.reload();
      if (apiStore?.newlyCreateedProject) {
        delete apiStore["newlyCreateedProject"];
        setApiStore({
          ...apiStore,
        });
      }
    }
  };

  const handleLoginButtonSSO = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "user.read"],
      });
      if (response && response.account) {
        onLoginWithSSOApi(response);
      }
    } catch (error) {
      showToastMessage("Something went wrong! Please try again.", "error");
      console.error(error);
    }
  };

  const handleCloseToaster = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToaster(false);
  };

  const showToastMessage = (message, type) => {
    setToasterMessage(message);
    setToasterType(type);
    setOpenToaster(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 4,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom right, #673ab7, #2196f3)",
      }}
    >
      {/* Background Animated Icons */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Quiz Icon */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <Quiz
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
        {/* Timer Icon */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "10%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <Timer
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
        {/* Check Circle Icon */}
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "30%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
      </Box>
      <div className="w-[95vw] flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center flex-col px-14 py-10 max-md:px-5 max-md:max-w-full rounded-[30px] drop-shadow-2xl bg-[#ffffff]">
          <div className="xl:w-[22vw] sm:w-[auto] flex items-center text-start justify-center flex-col">
            <div className="img-container mt-4">
              <img
                loading="lazy"
                src={Images.Logo}
                alt="thermax_logo"
                className="w-[100px] h-[auto]"
              />
            </div>
            <Box className="py-2 justify-center items-center text-center">
              <Typography fontWeight="medium" className="!text-[10px]">
                Welcome to TBWES Quality Quiz
              </Typography>
              <Typography variant="h4" fontWeight="medium">
                Sign in
              </Typography>
            </Box>
            <Box pt={2} px={3} className="w-full">
              <Box mt={4} mb={1}>
                <ColorButton
                  className="bg-[#0e1322] text-white px-2 w-[100%]"
                  fullWidth
                  onClick={() => handleLoginButtonSSO()}
                >
                  Login With SSO
                </ColorButton>
              </Box>
            </Box>
          </div>
        </div>
      </div>
      <Toaster
        toasterMessage={toasterMessage}
        toasterType={toasterType}
        openToaster={openToaster}
        handleCloseToaster={handleCloseToaster}
      />
      <style>
        {`
          @keyframes softMove {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-2px, -2px); }
            50% { transform: translate(2px, -2px); }
            75% { transform: translate(-2px, 2px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default SignIn;
