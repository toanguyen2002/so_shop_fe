import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/authAction";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Notification from "../../components/Notification/Notification";
import { sendOTP } from "../../api/userAPI";

const defaultTheme = createTheme();

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmPassword")) {
      setErrorMsg("Password and Confirm Password do not match");
      return;
    }
    const formData = {
      userName: data.get("email"),
      password: data.get("password"),
    };
    console.log("Form Data:", formData.userName);

    try {
      const response = await sendOTP({ userName: formData.userName });
      console.log("Response:", response);

      if (response.data.code === 500) {
        setErrorMsg("Email đã tồn tại trong hệ thống");
      } else if (response.status === 201) {
        setIsOtpSent(true);
        // setGeneratedOtp(response.data);
        navigate("/signup/verify-otp", {
          state: { formData, generatedOtp: response.data },
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMsg("An error occurred while sending OTP");
    }
  };

  useEffect(() => {
    console.log("Generated OTP:", generatedOtp);
  }, [generatedOtp]);

  // useEffect(() => {
  //   if (error && error.status) {
  //     setErrorMsg(error.status);
  //   } else {
  //     setErrorMsg("");
  //   }
  // }, [error]);

  // useEffect(() => {
  //   // Navigate to the home page on successful registration
  //   if (user && user.userName) {
  //     setSuccessMsg("Đăng Ký Thành Công! Đang chuyển hướng đến trang chủ...");
  //     setShowNotification(true);
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 3000);
  //   }
  // }, [user, navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* {showNotification && (
        <Notification
          message={successMsg}
          onClose={() => setShowNotification(false)}
        />
      )} */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                />
              </Grid>
              {errorMsg && (
                <Typography variant="body2" color="error">
                  {errorMsg}
                </Typography>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send OTP
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
