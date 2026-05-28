import { CustomButton } from "@components/button/CustomButton";
import TextWrapper from "@components/text/TextWrapper";
import SpiderNetBackground from "@features/auth/components/SpiderNetBackground";
import { useSetPasswordMutation } from "@core/store/api/authAPI";
import { TextField, Container, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconEye, IconEyeOff, IconPlus } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function SetPassword() {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const [setPassword, { isLoading, isError, isSuccess }] = useSetPasswordMutation();
    const location = useLocation();
    const activationId = new URLSearchParams(location.search).get("activationId") || "";
    const navigate = useNavigate();

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRetypePassword = () => setShowRetypePassword(prev => !prev);
    const bgPage = theme.vars?.palette.background.default ?? theme.palette.background.default;
    const bgPaper = theme.vars?.palette.background.paper ?? theme.palette.background.paper;
    const textPrimary = theme.vars?.palette.text.primary ?? theme.palette.text.primary;
    const textSecondary = theme.vars?.palette.text.secondary ?? theme.palette.text.secondary;
    const borderColor = theme.vars?.palette.divider ?? theme.palette.divider;
    const textFieldSx = {
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
    };
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
            await setPassword({ password: values.password, activationId }).unwrap();
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
                <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: bgPaper, color: textPrimary, backdropFilter: "blur(2px)" }}>
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
                        sx={textFieldSx}
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
                        sx={textFieldSx}
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
                            helperText={formik.touched.firstValue && formik.errors.firstValue}
                            sx={textFieldSx} />
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
                            helperText={formik.touched.secondValue && formik.errors.secondValue}
                            sx={textFieldSx} />
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
                            helperText={formik.touched.sum && formik.errors.sum}
                            sx={textFieldSx} />
                    </div>
                    <CustomButton
                        type="submit"
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
                    <div onClick={() => navigate('/')} className="flex text-green hover:text-blue flex-row items-center gap-2 cursor-pointer">
                        <TextWrapper className="pt-5" content={'PLEASE_LOGIN'} />
                    </div>
                </div>)}
                {isError && (<div className="px-5 flex flex-col items-center justify-center mb-4">
                    <TextWrapper className="text-red text-center" content={'ACTIVATION_FAILD'} />
                    <div onClick={() => navigate('/')} className="flex text-green hover:text-blue flex-row items-center gap-2 cursor-pointer">
                        <TextWrapper className="cursor-pointer" content={'PLEASE_LOGIN'} />
                    </div>
                </div>)}
                </Box>
            </Container>
        </Box>
    );
}
