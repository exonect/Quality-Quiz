import { Box } from "@mui/material";
import React, { useState } from "react";
import "./styles.css";

const NotFound = () => {
  return (
    <Box className="w-[100%] flex flex-col bg-[#e2e8f0]">
      <Box className="flex h-[100%] overflow-hidden">
        <Box className='flex flex-col w-full'>
          <Box className="bg-slate-200 w-[100%] h-full p-2 sm:p-4 space-y-3">
            <div className="flex justify-center items-center h-full">
              <h1>404 This page could not be found.</h1>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
