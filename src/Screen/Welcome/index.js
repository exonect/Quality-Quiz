import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Welcome = () => {
  const navigate = useNavigate();
  const [isUserLogdin, setIsUserLogdin] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userRoleData = JSON.parse(localStorage.getItem("userRole"));
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (accessToken && userRoleData) {
      setIsUserLogdin(true);
      setUserRole(userRoleData)
      if (userRoleData === 'participant') {
        navigate("/quiz/dashboard");
      }
      if (userRoleData === 'jury') {
        navigate("/dashboard");
      }
    } else {
      // window.location.reload();
      setIsUserLogdin(false);
      setUserRole(null);
    }
  }, []);

  return (
    <Box className="w-[100%] flex flex-col bg-[#fff]">
      <Box className="flex h-[100%] overflow-hidden"></Box>
    </Box>
  );
};

export default Welcome;
