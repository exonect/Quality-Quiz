import React, { useEffect, useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { GetTop50UsersApi } from "../../Helper/Api";
import Toaster from "../../Helper/Components/Toaster";
import AppLoading from "../../Helper/Components/AppLoading";
import SimpleBarChart from "../../Helper/Components/SimpleBarChart";

const QuizDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isAscending, setIsAscending] = useState(false);
  const [openToaster, setOpenToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [top50UsersList, setTop50UsersList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // State for selected department
  const [departments, setDepartments] = useState([]); // State for department list

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

  const GetTop50Users = async () => {
    const top50UsersData = await GetTop50UsersApi();
    if (top50UsersData.status >= 200 && top50UsersData.status <= 300) {
      setTop50UsersList(top50UsersData.data);
      setDepartments([
        ...new Set(top50UsersData.data.map((user) => user.user_department)),
      ]); // Extract unique departments
      setIsLoading(false);
    } else {
      setIsLoading(false);
      showToastMessage("Something went wrong, please try again", "error");
    }
  };

  useEffect(() => {
    GetTop50Users();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / 1000; // duration in seconds
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getDisplayedParticipants = () => {
    let displayed = [];
    if (tabValue === 0) displayed = top50UsersList.slice(0, 50);
    if (tabValue === 1) displayed = top50UsersList.slice(0, 15);
    if (tabValue === 2) displayed = top50UsersList.slice(0, 3);

    // Filter based on selected department
    if (selectedDepartment) {
      displayed = displayed.filter(
        (participant) => participant.user_department === selectedDepartment
      );
    }

    return isAscending
      ? displayed.sort((a, b) => a.score - b.score)
      : displayed.sort((a, b) => b.score - a.score);
  };

  const getScoresByDepartment = () => {
    const departmentScores = {};
    top50UsersList.forEach((user) => {
      const department = user.user_department;
      if (!departmentScores[department]) {
        departmentScores[department] = 0;
      }
      departmentScores[department] += user.score;
    });
    return Object.keys(departmentScores).map((dept) => ({
      name: dept,
      score: departmentScores[dept],
    }));
  };

  const getChartData = () => {
    const data = getScoresByDepartment();
    // Filter chart data based on selected department
    return selectedDepartment
      ? data.filter((item) => item.name === selectedDepartment)
      : data;
  };

  const downloadPDF = (data, fileName) => {
    const doc = new jsPDF();
    doc.text("Quiz Participants", 20, 10);

    const startY = 20;

    doc.autoTable({
      head: [["Name", "Email", "Department", "Score", "Duration"]],
      body: data.map((participant) => [
        participant.user_full_name,
        participant.user_email,
        participant.user_department,
        participant.score,
        getDuration(
          participant.formatted_start_time,
          participant.formatted_end_time
        ),
      ]),
      startY: startY,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 30 },
    });

    doc.save(fileName);
  };

  const downloadAllParticipantsPDF = () => {
    const dataToExport = selectedDepartment
      ? top50UsersList.filter(
          (user) => user.user_department === selectedDepartment
        )
      : top50UsersList;

    downloadPDF(dataToExport, "all_participants.pdf");
  };

  const downloadSelectedParticipantsPDF = () => {
    const displayedParticipants = getDisplayedParticipants();
    downloadPDF(displayedParticipants, "selected_participants.pdf");
  };

  const getDownloadButtonLabel = () => {
    switch (tabValue) {
      case 0:
        return "Export Top 50 Data";
      case 1:
        return "Export Top 15 Data";
      case 2:
        return "Export Top 3 Data";
      default:
        return "Export Selected Data";
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-600 p-4 text-white">
      {isLoading && (
        <div className="flex justify-center items-center h-full left-0 right-0 top-0 bottom-0 absolute bg-black bg-opacity-20 z-[9999999999]">
          <AppLoading />
        </div>
      )}
      <AppBar position="static" elevation={0} className="bg-transparent">
        <Toolbar>
          <Typography variant="h4">Quiz Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {/* First Row: Participation Overview and Chart */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={6}
            className="p-6 mb-4 rounded-lg shadow-lg bg-white"
          >
            <div className="flex row justify-between">
              <Grid item xs={3} className="flex !flex-col justify-between">
                {/* Overview Statistics */}
                <Grid container spacing={1} className="mt-4">
                  <Grid item xs={12}>
                    <Paper className="bg-gradient-to-r from-blue-500 to-blue-700 p-[8px] rounded-lg text-center shadow-md">
                      <Typography variant="h6">Total Participants</Typography>
                      <Typography variant="h4">
                        {top50UsersList.length}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid container spacing={1} className="mt-2">
                  <Grid item xs={12}>
                    <Paper className="bg-gradient-to-r from-green-500 to-green-700 p-[8px] rounded-lg text-center shadow-md">
                      <Typography variant="h6">Max Score</Typography>
                      <Typography variant="h4">
                        {Math.max(...top50UsersList.map((p) => p.score))}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid container spacing={1} className="mt-2">
                  <Grid item xs={12}>
                    <Paper className="bg-gradient-to-r from-red-500 to-red-700 p-[8px] rounded-lg text-center shadow-md">
                      <Typography variant="h6">Min Score</Typography>
                      <Typography variant="h4">
                        {Math.min(...top50UsersList.map((p) => p.score))}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={8.8}>
                <Paper
                  elevation={3}
                  className="p-4 rounded-lg shadow-lg bg-white"
                >
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800"
                  >
                    Score Distribution by Department
                  </Typography>
                  <SimpleBarChart data={getChartData()} />
                </Paper>
              </Grid>
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* Second Row: Tabs, Filter, and Export Buttons */}
      <Box
        sx={{ width: "100%", mb: 2 }}
        className="flex justify-between items-center mt-4"
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user ranking tabs"
          textColor="inherit"
          indicatorColor="secondary"
          centered
        >
          <Tab label="Top 50 Users" />
          {/* <Tab label="Top 15 Users" />
          <Tab label="Top 3 Users" /> */}
        </Tabs>
        <div className="flex items-center">
          <div className="mr-2">
            <FormControl
              variant="outlined"
              style={{ minWidth: 150 }}
              size="small"
            >
              <InputLabel
                sx={{
                  color: "#fff",
                  "&.Mui-focused": {
                    color: "#fff",
                  },
                }}
                id="department-select-label"
              >
                Department
              </InputLabel>
              <Select
                sx={{
                  color: "#fff", // Custom color for the text
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff", // Custom color for the border
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff", // Custom color when focused
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff", // Custom color on hover
                  },
                }}
                className="text-[#fff]"
                labelId="department-select-label"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                label="Department"
              >
                <MenuItem value="">
                  All
                </MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={downloadAllParticipantsPDF}
            className="ml-4"
          >
            Export All Data
          </Button>
          <div className="ml-2">
            <Button
              variant="contained"
              color="secondary"
              onClick={downloadSelectedParticipantsPDF}
            >
              {getDownloadButtonLabel()}
            </Button>
          </div>
        </div>
      </Box>

      {/* Third Row: Participants Table */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} className="p-4 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Participants List
            </Typography>
            <TableContainer style={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>
                      <Box className="flex items-center">
                        Score
                        {isAscending ? (
                          <ArrowDownwardIcon
                            onClick={() => setIsAscending(false)}
                            style={{ cursor: "pointer", marginLeft: 4 }}
                          />
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => setIsAscending(true)}
                            style={{ cursor: "pointer", marginLeft: 4 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getDisplayedParticipants().map((participant) => (
                    <TableRow key={participant.user}>
                      <TableCell>{participant.user_full_name}</TableCell>
                      <TableCell>{participant.user_email}</TableCell>
                      <TableCell>{participant.user_department}</TableCell>
                      <TableCell>{participant.score}</TableCell>
                      <TableCell>
                        {getDuration(
                          participant.formatted_start_time,
                          participant.formatted_end_time
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

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
