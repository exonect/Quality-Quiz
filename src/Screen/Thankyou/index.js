import { CheckCircle, Quiz, Timer } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
    Box,
    Button,
    Paper,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import {
    signOut
} from "../../Helper/Api";
import AppLoading from "../../Helper/Components/AppLoading";
import Toaster from "../../Helper/Components/Toaster";

const QuizDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openToaster, setOpenToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");

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

  const onPostQuizAnswer = async () => {
    showToastMessage("User Logout successfully!", "success");
    signOut();
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
      {isLoading && (
        <div className="flex justify-center items-center h-full left-0 right-0 top-0 bottom-0 absolute bg-black bg-opacity-20 z-[9999999999]">
          <AppLoading />
        </div>
      )}

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
      <div className="absolute top-[10px] right-[10px] z-10">
        <Button
          onClick={() => {
            onPostQuizAnswer(true);
          }}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            bgcolor: "rgba(0, 0, 0, 0.1)",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" },
            width: { xs: "100%" },
          }}
          variant="outlined"
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </div>
      <Paper
        elevation={3}
        sx={{
          maxHeight: "80vh",
          overflow: "auto",
          width: "100%",
          maxWidth: 800,
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          bgcolor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          zIndex: 1,
          animation: "fadeIn 0.5s",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ textAlign: "center", mb: 4, color: '#fff' }}>
            Thank you for your enthusiasm and interest in the quiz! The first
            round of the quiz competition has now been completed!
          </Typography>
        </Box>
      </Paper>

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
      <Toaster
        toasterMessage={toasterMessage}
        toasterType={toasterType}
        openToaster={openToaster}
        handleCloseToaster={handleCloseToaster}
      />
    </Box>
  );
};

export default QuizDashboard;
