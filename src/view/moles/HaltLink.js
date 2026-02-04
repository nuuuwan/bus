import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function HaltLink({ halt }) {
  const location = useLocation();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  return (
    <Link
      to={`/${latLng}/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%" }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{}}>
        <Typography variant="body1">{halt.displayName}</Typography>
      </Box>
    </Link>
  );
}
