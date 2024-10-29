import { Alert, Snackbar } from "@mui/material";
import React from "react";

const Toaster = ({
  toasterMessage,
  toasterType,
  openToaster,
  handleCloseToaster,
}) => {
  return (
    <div>
      {/* <ToastContainer style={{ fontSize: "14px" }} /> */}
      <Snackbar
      style={{zIndex: 9999999}}
        open={openToaster}
        autoHideDuration={2000}
        onClose={handleCloseToaster}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToaster}
          severity={toasterType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toasterMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Toaster;
