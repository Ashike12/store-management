import { CustomButton } from "@components/button/CustomButton";
import TextWrapper from "@components/text/TextWrapper";
import { useSetPasswordMutation } from "@core/store/api/authAPI";
import { TextField, Container, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import { IconEye, IconEyeOff, IconPlus } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

export default function setPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const [setPassword, { isLoading, isError, isSuccess }] = useSetPasswordMutation();
    const activationId = new URLSearchParams(window.location.search).get("activationId") || "";

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRetypePassword = () => setShowRetypePassword(prev => !prev);
    const formik = useFormik({
        initialValues: {
            password: "",
            retypePassword: "",
            firstValue: Math.ceil(Math.random() * 100),
            secondValue: Math.ceil(Math.random() * 100),
            sum: 0,
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),

            retypePassword: Yup.string()
                .oneOf([Yup.ref("password"), ''], "Passwords must match")
                .required("Please retype your password"),
            firstValue: Yup.string(),
            secondValue: Yup.string(),
            sum: Yup.string()
                .required("Please retype your password"),
        }),
        onSubmit: async (values) => {
            console.log("Login Data:", values);
            await setPassword({ password: values.password, activationId }).unwrap();
        },
    });

    return (
        <Container className="" maxWidth="xs">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Reset Password
                </Typography>
                {!isSuccess && (<form className="p-5" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        variant="outlined"
                        margin="normal"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowPassword} edge="end">
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Retype Password"
                        type={showRetypePassword ? 'text' : 'password'}
                        name="retypePassword"
                        variant="outlined"
                        margin="normal"
                        autoComplete="new-password"
                        value={formik.values.retypePassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.retypePassword && Boolean(formik.errors.retypePassword)}
                        helperText={formik.touched.retypePassword && formik.errors.retypePassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowRetypePassword} edge="end">
                                        {showRetypePassword ? <IconEyeOff /> : <IconEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <div className="flex flex-row gap-2 mt-4">
                        <TextField
                            disabled
                            type='number'
                            name="firstValue"
                            variant="outlined"
                            autoComplete="new-password"
                            value={formik.values.firstValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstValue && Boolean(formik.errors.firstValue)}
                            helperText={formik.touched.firstValue && formik.errors.firstValue} />
                        <TextField
                            disabled
                            type='number'
                            name="secondValue"
                            variant="outlined"
                            autoComplete="new-password"
                            value={formik.values.secondValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.secondValue && Boolean(formik.errors.secondValue)}
                            helperText={formik.touched.secondValue && formik.errors.secondValue} />
                        <div className="pt-2">
                            <IconPlus size={36}></IconPlus>
                        </div>

                        <TextField
                            type='number'
                            name="sum"
                            variant="outlined"
                            autoComplete="new-password"
                            value={formik.values.sum}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.sum && Boolean(formik.errors.sum)}
                            helperText={formik.touched.sum && formik.errors.sum} />
                    </div>
                    <CustomButton
                        disabled={!(formik.dirty && formik.isValid && !isLoading && formik.values.sum === (formik.values.firstValue + formik.values.secondValue))}
                        className="w-full cursor-pointer mt-4"
                        text={'SET_PASSWORD'}
                        loading={isLoading}
                        iconAlign="left"
                        variant={'primary'}
                    />
                </form>)}
                {isSuccess && (<div className="p-5 flex flex-col items-center justify-center mb-4">
                    <TextWrapper variant={"H4Bold"} className="text-center" content={'PASSWORD_SET_SUCCESSFULLY'} />
                    <div onClick={() => window.location.href = '/login'} className="flex text-green hover:text-blue flex-row items-center gap-2 cursor-pointer">
                        <TextWrapper className="pt-5" content={'PLEASE_LOGIN'} />
                    </div>
                </div>)}
                {isError && (<div className="px-5 flex flex-col items-center justify-center mb-4">
                    <TextWrapper className="text-red text-center" content={'ACTIVATION_FAILD'} />
                    <div onClick={() => window.location.href = '/login'} className="flex text-green hover:text-blue flex-row items-center gap-2 cursor-pointer">
                        <TextWrapper className="cursor-pointer" content={'PLEASE_LOGIN'} />
                    </div>
                </div>)}
            </Box>
        </Container>
    );
}
