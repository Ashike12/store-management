import { CustomButton } from "@components/button/CustomButton";
import SpiderNetBackground from "@features/auth/components/SpiderNetBackground";
import { useGetAuthDataMutation } from "@core/store/api/authAPI";
import { TextField, Container, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Login() {
  const [login, { isLoading }] = useGetAuthDataMutation();
  const theme = useTheme();
  const bgPage = theme.vars?.palette.background.default ?? theme.palette.background.default;
  const bgPaper = theme.vars?.palette.background.paper ?? theme.palette.background.paper;
  const textPrimary = theme.vars?.palette.text.primary ?? theme.palette.text.primary;
  const textSecondary = theme.vars?.palette.text.secondary ?? theme.palette.text.secondary;
  const borderColor = theme.vars?.palette.divider ?? theme.palette.divider;
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      await login(values).unwrap();
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(140deg, ${bgPage} 0%, ${bgPaper} 100%)`,
      }}
    >
      <SpiderNetBackground />
      <Container className="" maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: bgPaper,
            color: textPrimary,
            backdropFilter: "blur(2px)",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form className="p-5" onSubmit={formik.handleSubmit}>
            <TextField
              autoComplete="off"
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                "& .MuiInputBase-input": {
                  color: textPrimary,
                },
                "& .MuiInputLabel-root": {
                  color: textSecondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: textPrimary,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderColor,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              margin="normal"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                "& .MuiInputBase-input": {
                  color: textPrimary,
                },
                "& .MuiInputLabel-root": {
                  color: textSecondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: textPrimary,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderColor,
                },
              }}
            />
            <CustomButton
              type="submit"
              disabled={!(formik.dirty && formik.isValid && !isLoading)}
              className="w-full cursor-pointer mt-4"
              text={'LOGIN'}
              loading={isLoading}
              iconAlign="left"
              variant={'primary'}
            />
          </form>
        </Box>
      </Container>
    </Box>
  );
}
