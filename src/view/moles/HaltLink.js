import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function HaltLink({ halt }) {
  return (
    <Link
      to={`/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%" }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{}}>
        <Typography variant="body1">{halt.displayName}</Typography>
      </Box>
    </Link>
  );
}
