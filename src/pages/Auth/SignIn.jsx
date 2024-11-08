import * as React from "react";
import { useState } from "react";
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
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../actions/authAction";
import { resetPassAPI } from "../../api/userAPI";
import Notification from "../../components/Notification/Notification";

const defaultTheme = createTheme();

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      userName: data.get("email"),
      password: data.get("password"),
    };
    dispatch(login(formData));

    console.log({
      userName: data.get("email"),
      password: data.get("password"),
      error,
      user,
    });
  };

  useEffect(() => {
    if (user && user.status) {
      setErrorMsg(user.status);
    } else {
      setErrorMsg("");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.userName) {
      setSuccessMsg(true);
      navigate("/", { state: { successMessage: "Đăng Nhập Thành Công!" } });
    }
  }, [user, navigate]);

  const handleSubmitForgotPassword = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      userName: data.get("email"),
    };
    try {
      await resetPassAPI(formData);
      setShowNotification(true); // Show notification on success
      setShowForgotPassword(false); // Return to sign-in form
    } catch (error) {
      setErrorMsg("Reset Password thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {showNotification && (
        <Notification
          message="Reset Password thành công. Vui lòng kiểm tra Email của bạn."
          onClose={() => setShowNotification(false)}
        />
      )}
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
            {showForgotPassword ? "Forgot Password" : "Sign in"}
          </Typography>
          {showForgotPassword ? (
            <Box
              component="form"
              onSubmit={handleSubmitForgotPassword}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
              <Link
                variant="body2"
                onClick={() => setShowForgotPassword(false)}
                style={{ cursor: "pointer" }}
              >
                Back to Sign In
              </Link>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

              {errorMsg && (
                <Typography variant="body2" color="error">
                  {errorMsg}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    variant="body2"
                    onClick={() => setShowForgotPassword(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup">{"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
