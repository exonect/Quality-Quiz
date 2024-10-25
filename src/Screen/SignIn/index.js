import { Button, Typography } from "@mui/material";
// import CircularProgress from '@mui/joy/CircularProgress';
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginWithSSOApi } from "../../Helper/Api";
import { Images } from "../../Helper/Assets/images";
import Toaster from "../../Helper/Components/Toaster";
import { AppContext } from "../../Helper/Context/AppContextProvider";
import { msalInstance } from "../../msalConfig";
import { styled } from "@mui/material/styles";

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

  const handleLoginButtonSSO = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "user.read"],
      });
      if (response && response.account) {
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
          // localStorage.setItem(
          //   "refreshToken",
          //   JSON.stringify(ssoAPIRes?.detail?.refresh_token)
          // );
          localStorage.setItem("userInfo", JSON.stringify(ssoAPIRes.detail));
          setApiStore({ ...apiStore, login: ssoAPIRes.detail });
          navigate("/sales/dashboard");
          window.location.reload();
          if (apiStore?.newlyCreateedProject) {
            delete apiStore["newlyCreateedProject"];
            setApiStore({
              ...apiStore,
            });
          }
        } else if (ssoAPIRes.status === 400) {
          alert(ssoAPIRes.detail);
          console.error("ssoAPIRes=====", ssoAPIRes);
        }
      }
    } catch (error) {
      localStorage.setItem(
        "accessToken",
        JSON.stringify('@@@ASDFAGFKARFOFAJFNAOFNNL120394uskjfgjngf#$!@$@$^&%^$#@easlkjdfbalkerjfdnSDFFf;lkjb')
      );
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
    <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-[#ffffff]">
      <div className="w-full h-full fixed t-0 b-0 r-0 l-0 ">
        <img
          src={Images.QuizBackground}
          alt="app_background_img"
          className="w-full h-full fixed t-0 b-0 r-0 l-0"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
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
    </div>
  );
};

export default SignIn;
