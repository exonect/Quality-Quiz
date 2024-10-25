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
} from "@mui/material";
import { Home, Favorite, Settings, Star, Info } from "@mui/icons-material"; // Example icons
import Toaster from "../../Helper/Components/Toaster";
import { GetQuizQuestionApi } from "../../Helper/Api";
import AppLoading from "../../Helper/Components/AppLoading";

const departments = ["Department 1", "Department 2", "Department 3"];

const QuizDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
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

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      alert("Time is up! Quiz Completed!");
      resetQuiz();
    }
  }, [timerActive, timeLeft]);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      if (activeStep < quizQuestions.length - 1) {
        setActiveStep((prev) => prev + 1);
        setSelectedAnswer("");
      } else {
        alert("Quiz Completed!");
        resetQuiz();
      }
    }
  };

  const getQuizQuestionList = async () => {
    setIsLoading(true);
    const QuizQuestionListData = await GetQuizQuestionApi();
    if (
      QuizQuestionListData.status >= 200 &&
      QuizQuestionListData.status <= 300
    ) {
      setQuizQuestions(QuizQuestionListData.data);
      setIsLoading(false);
      setIsQuizStarted(true);
      setTimerActive(true);
    } else {
      setIsLoading(false);
      showToastMessage(QuizQuestionListData.data.error, "error");
    }
  };

  const handleStartQuiz = () => {
    getQuizQuestionList();
  };

  const resetQuiz = () => {
    setActiveStep(0);
    setSelectedAnswer("");
    setSelectedDepartment("");
    setIsQuizStarted(false);
    setTimeLeft(40);
    setTimerActive(false);
  };

  const getTimerColor = () => {
    const ratio = timeLeft / 40; // Time ratio from 0 to 1
    const red = Math.floor((1 - ratio) * 255); // Increases red as time decreases
    const green = Math.floor(ratio * 255); // Decreases green as time decreases
    return `rgb(${red}, ${green}, 0)`; // Transition from green to red
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
          pointerEvents: "none", // To ensure clicks go through to the quiz
          overflow: "hidden",
        }}
      >
        {[Home, Favorite, Settings, Star, Info].map((IconComponent, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: `${Math.random() * 80}%`, // Random percentage for y position
              left: `${Math.random() * 80}%`, // Random percentage for x position
              transform: "translate(-50%, -50%)", // Center the icon
              animation: `softMove ${
                15 + Math.random() * 10
              }s ease-in-out infinite alternate`,
            }}
          >
            <IconComponent
              sx={{
                fontSize: 60 + Math.random() * 40, // Random size
                color: "rgba(255, 255, 255, 0.5)",
                animation: `spin 10s linear infinite`,
              }}
            />
          </Box>
        ))}
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: "80%",
          p: 6,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        {!isQuizStarted ? (
          <Box textAlign="center">
            <Typography
              variant="h4"
              sx={{ mb: 4, fontWeight: "bold", color: "#333" }}
            >
              Select Department
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                {departments.map((dept, index) => (
                  <FormControlLabel
                    key={index}
                    value={dept}
                    control={<Radio />}
                    label={<span style={{ fontWeight: "bold" }}>{dept}</span>}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartQuiz}
                disabled={!selectedDepartment}
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
              <span style={{ color: getTimerColor() }}>{timeLeft} seconds</span>
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
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  >
                    <FormControlLabel
                      value={quizQuestions[activeStep].option_1}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_1}
                    />
                    <FormControlLabel
                      value={quizQuestions[activeStep].option_2}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_2}
                    />
                    <FormControlLabel
                      value={quizQuestions[activeStep].option_3}
                      control={<Radio />}
                      label={quizQuestions[activeStep].option_3}
                    />
                    <FormControlLabel
                      value={quizQuestions[activeStep].option_4}
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
                    Next
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