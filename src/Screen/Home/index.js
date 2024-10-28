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
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  // GetTop15UsersApi, GetTop3UsersApi,
  GetTop50UsersApi,
} from "../../Helper/Api";
import Toaster from "../../Helper/Components/Toaster";
import AppLoading from "../../Helper/Components/AppLoading";

// Sample participant data (60 users)
const participants = Array.from({ length: 60 }, (_, index) => ({
  user: 643 + index,
  user_email: `user${643 + index}@example.com`,
  user_full_name: `User ${643 + index}`,
  user_department: "Department",
  score: Math.floor(Math.random() * 10), // Random score between 0-9
  duration: `00:${Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0")}`,
}));

const QuizDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isAscending, setIsAscending] = useState(false);
  const [openToaster, setOpenToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [top50UsersList, setTop50UsersList] = useState([]);
  // const [top15UsersList, setTop15UsersList] = useState([]);
  // const [top3UsersList, setTop3UsersList] = useState([]);

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

  // const GetTop3Users = async () => {
  //   const top3UsersData = await GetTop3UsersApi();
  //   if (top3UsersData.status >= 200 && top3UsersData.status <= 300) {
  //     setIsLoading(false);
  //     setTop3UsersList(top3UsersData.data);
  //   } else {
  //     setIsLoading(false);
  //     showToastMessage("Something went wrong, please try again", "error");
  //   }
  // };
  // const GetTop15Users = async () => {
  //   const top15UsersData = await GetTop15UsersApi();
  //   if (top15UsersData.status >= 200 && top15UsersData.status <= 300) {
  //     setTop15UsersList(top15UsersData.data);
  //     GetTop3Users()
  //   } else {
  //     setIsLoading(false);
  //     showToastMessage("Something went wrong, please try again", "error");
  //   }
  // };

  const GetTop50Users = async () => {
    const top50UsersData = await GetTop50UsersApi();
    if (top50UsersData.status >= 200 && top50UsersData.status <= 300) {
      setTop50UsersList(top50UsersData.data);
      // GetTop15Users()
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

  const getDisplayedParticipants = () => {
    let displayed = [];
    if (tabValue === 0) displayed = participants.slice(0, 50);
    if (tabValue === 1) displayed = participants.slice(0, 15);
    if (tabValue === 2) displayed = participants.slice(0, 3);

    return isAscending
      ? displayed.sort((a, b) => a.score - b.score)
      : displayed.sort((a, b) => b.score - a.score);
  };

  const getChartData = () => {
    const displayedParticipants = getDisplayedParticipants();
    return displayedParticipants.map((participant) => ({
      name: participant.user_full_name,
      score: participant.score,
    }));
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
        participant.duration,
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
    downloadPDF(participants, "all_participants.pdf");
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

      <Paper elevation={6} className="p-6 mb-4 rounded-lg shadow-lg bg-white">
        <Typography
          variant="h5"
          className="text-center font-semibold text-gray-800"
        >
          Participation Overview
        </Typography>
        <Grid container spacing={2} className="mt-4">
          <Grid item xs={4}>
            <Paper className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-lg text-center shadow-md">
              <Typography variant="h6">Total Participants</Typography>
              <Typography variant="h4">{participants.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="bg-gradient-to-r from-green-500 to-green-700 p-4 rounded-lg text-center shadow-md">
              <Typography variant="h6">Max Score</Typography>
              <Typography variant="h4">
                {Math.max(...participants.map((p) => p.score))}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="bg-gradient-to-r from-red-500 to-red-700 p-4 rounded-lg text-center shadow-md">
              <Typography variant="h6">Min Score</Typography>
              <Typography variant="h4">
                {Math.min(...participants.map((p) => p.score))}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Box
        sx={{ width: "100%", mb: 2 }}
        className="flex justify-between items-center"
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
        <div className="flex">
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Score Distribution Chart
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={getChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" tick={{ fill: "#333" }} />
                <YAxis tick={{ fill: "#333" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#ddd",
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="#82ca9d" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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
                      <TableCell>{participant.duration}</TableCell>
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
