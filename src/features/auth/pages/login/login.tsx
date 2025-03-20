import { CustomButton } from "@components/button/CustomButton";
import { useGetAuthDataMutation } from "@core/store/api/authAPI";
import { TextField, Container, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function login() {
  const [login, { isLoading }] = useGetAuthDataMutation();
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
      console.log("Login Data:", values);
      await login(values).unwrap();
    },
  });

  return (
    <Container className="" maxWidth="xs">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
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
          />
          <CustomButton
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
  );
}
