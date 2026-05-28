import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AppLoader() {
  const theme = useTheme();
  const background = theme.vars?.palette.background.default ?? theme.palette.background.default;
  const primary = theme.vars?.palette.primary.main ?? theme.palette.primary.main;
  const text = theme.vars?.palette.text.secondary ?? theme.palette.text.secondary;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        backgroundColor: background,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 96,
          height: 96,
          "@keyframes ringShrink": {
            "0%": { transform: "scale(1)", opacity: 0.95 },
            "60%": { transform: "scale(0.56)", opacity: 0.62 },
            "100%": { transform: "scale(0.25)", opacity: 0.05 },
          },
        }}
      >
        {[0, 0.25, 0.5].map((delay) => (
          <Box
            key={delay}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${primary}`,
              animation: "ringShrink 1.4s ease-in-out infinite",
              animationDelay: `${delay}s`,
              boxShadow: `0 0 18px ${primary}33`,
            }}
          />
        ))}
      </Box>

      <Typography variant="body2" sx={{ color: text, letterSpacing: 1.4 }}>
        Loading...
      </Typography>
    </Box>
  );
}
