import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { Info, Quiz, Timer, CheckCircle, Assignment, Star, School, Book } from "@mui/icons-material"; // Added more icons
import Toaster from "../../Helper/Components/Toaster";
import { GetQuizQuestionApi, PostQuizAnswerApi } from "../../Helper/Api";
import AppLoading from "../../Helper/Components/AppLoading";

const departments = ["Department 1", "Department 2", "Department 3"];

const QuizDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswerList, setSelectedAnswerList] = useState([]);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswerQId, setSelectedAnswerQId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [openToaster, setOpenToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog

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
    setIsLoading(true);
    const postQuizAnswerData = await PostQuizAnswerApi({
      score: "100",
      user: 1,
      start_time: quizStartTime,
      end_time: quizEndTime,
      responses: selectedAnswerList,
    });
    if (postQuizAnswerData.status >= 200 && postQuizAnswerData.status <= 300) {
      setIsLoading(false);
      showToastMessage("Quiz Completed!", "success");
      resetQuiz();
    } else {
      resetQuiz();
      setIsLoading(false);
      showToastMessage('Something went wrong, please try again', "error");
    }
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      showToastMessage("Time is up! Quiz Completed!", "error");
      const EndTime = new Date();
      setQuizEndTime(EndTime.getTime());
      onPostQuizAnswer();
    }
  }, [timerActive, timeLeft]);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      selectedAnswerList.push({
        question_id: selectedAnswerQId,
        selected_answer: selectedAnswer,
      });
      setSelectedAnswerList([...selectedAnswerList]);
      if (activeStep < quizQuestions.length - 1) {
        setActiveStep((prev) => prev + 1);
        setSelectedAnswer("");
        setSelectedAnswerQId("");
      } else {
        const EndTime = new Date();
        setQuizEndTime(EndTime.getTime());
        onPostQuizAnswer();
      }
    }
  };

  const getQuizQuestionList = async () => {
    setIsLoading(true);
    const quizQuestionListData = await GetQuizQuestionApi();
    if (
      quizQuestionListData.status >= 200 &&
      quizQuestionListData.status <= 300
    ) {
      setQuizQuestions(quizQuestionListData.data);
      setIsLoading(false);
      setIsQuizStarted(true);
      setTimerActive(true);
    } else {
      setIsLoading(false);
      showToastMessage(quizQuestionListData.data.error, "error");
    }
  };

  const handleStartQuiz = () => {
    const StartTime = new Date();
    setQuizStartTime(StartTime.getTime());
    getQuizQuestionList();
  };

  const resetQuiz = () => {
    setActiveStep(0);
    setSelectedAnswer("");
    setSelectedAnswerQId("");
    setSelectedAnswerList([]);
    setSelectedDepartment("");
    setIsQuizStarted(false);
    setTimeLeft(600); // Reset to 10 minutes
    setTimerActive(false);
    setQuizStartTime(null);
    setQuizEndTime(null);
    setAcceptedTerms(false); // Reset terms acceptance
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const ratio = timeLeft / 600; // Time ratio from 0 to 1
    const red = Math.floor((1 - ratio) * 255); // Increases red as time decreases
    const green = Math.floor(ratio * 255); // Decreases green as time decreases
    return `rgb(${red}, ${green}, 0)`; // Transition from green to red
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
            top: "5%",
            left: "5%",
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
            top: "5%",
            right: "5%",
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
            left: "15%",
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
        {/* Assignment Icon */}
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <Assignment
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
        {/* Star Icon */}
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            left: "20%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <Star
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
        {/* School Icon */}
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: "20%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <School
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
        {/* Book Icon */}
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "40%",
            animation: `softMove 15s ease-in-out infinite alternate`,
          }}
        >
          <Book
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.5)",
              animation: `spin 10s linear infinite`,
            }}
          />
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          zIndex: 1,
          animation: "fadeIn 0.5s",
        }}
      >
        {!isQuizStarted ? (
          <Box>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
              Welcome to the Quiz
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departments.map((dept, index) => (
                  <MenuItem key={index} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    color="primary"
                  />
                }
                label={
                  <span>
                    I accept the terms and conditions 
                    <IconButton onClick={handleOpenDialog} size="small">
                      <Info fontSize="inherit" />
                    </IconButton>
                  </span>
                }
              />
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Quiz Rules and Eligibility</DialogTitle>
                <DialogContent>
                  <Typography>
                    <strong>Eligibility:</strong> Must belong to the selected department.<br />
                    <strong>Format:</strong> 10 multiple-choice questions with four options each.<br />
                    <strong>Time Limit:</strong> 10 minutes to complete the quiz.<br />
                    <strong>Auto Submission:</strong> Quiz submits automatically when time is up or if the connection is lost.<br />
                    <strong>One Answer Only:</strong> No going back once "Next" is clicked.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartQuiz}
                disabled={!selectedDepartment || !acceptedTerms}
                sx={{
                  width: "100%",
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#304ffe" },
                  transition: "background-color 0.3s",
                }}
              >
                Start Quiz
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 2,
                fontWeight: "bold",
                color: getTimerColor(),
              }}
            >
              Time Left:{" "}
              <span style={{ color: getTimerColor() }}>{formatTime(timeLeft)}</span>
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {quizQuestions.map((_, index) => (
                <Step key={index}>
                  <StepLabel>{`Question ${index + 1}`}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep < quizQuestions.length ? (
              <Box mt={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {quizQuestions[activeStep].question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => {
                      setSelectedAnswer(e.target.value);
                      setSelectedAnswerQId(quizQuestions[activeStep].id);
                    }}
                  >
                    <FormControlLabel
                      value={"option_1"}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_1}
                    />
                    <FormControlLabel
                      value={"option_2"}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_2}
                    />
                    <FormControlLabel
                      value={"option_3"}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_3}
                    />
                    <FormControlLabel
                      value={"option_4"}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_4}
                    />
                  </RadioGroup>
                </FormControl>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    sx={{
                      bgcolor: "#4caf50",
                      "&:hover": { bgcolor: "#388e3c" },
                      width: "40%",
                    }}
                  >
                    {activeStep < quizQuestions.length - 1 ? "Next" : "Submit"}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="h5" sx={{ mt: 4, textAlign: "center" }}>
                Quiz Completed!
              </Typography>
            )}
          </Box>
        )}
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
