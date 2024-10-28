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
        {[Home, Favorite, Settings, Star, Info].map((IconComponent, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              transform: "translate(-50%, -50%)",
              animation: `softMove ${15 + Math.random() * 10}s ease-in-out infinite alternate`,
            }}
          >
            <IconComponent
              sx={{
                fontSize: 60 + Math.random() * 40,
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
