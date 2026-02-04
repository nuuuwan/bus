import { Box, Typography, CircularProgress } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import RouteLink from "../moles/RouteLink";
import HaltLink from "../moles/HaltLink";

export default function RoutePage() {
  const { selectedRoute, loading } = useData();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedRoute) {
    return (
      <Box p={3}>
        <Typography variant="h5">Route not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={1}>
        <RouteLink route={selectedRoute} />

        <Timeline
          position="right"
          sx={{
            padding: 0,
            margin: 0,
            "& .MuiTimelineItem-root": {
              "&:before": {
                display: "none",
              },
            },
          }}
        >
          {selectedRoute.haltList.map((halt, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                {index > 0 && <TimelineConnector />}
                <TimelineDot>
                  <PlaceIcon fontSize="small" />
                </TimelineDot>
                {index < selectedRoute.haltList.length - 1 && (
                  <TimelineConnector />
                )}
              </TimelineSeparator>
              <TimelineContent sx={{ display: "flex", alignItems: "center" }}>
                <Link
                  to={`/halt/${encodeURIComponent(halt.id)}`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <HaltLink halt={halt} />
                </Link>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Box>
  );
}
