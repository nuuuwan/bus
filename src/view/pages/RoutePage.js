import { Box, Typography, CircularProgress } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import PlaceIcon from "@mui/icons-material/Place";
import { useData } from "../../nonview/contexts/DataContext";
import HaltLink from "../moles/HaltLink";

export default function RoutePage() {
  const { selectedRoute, currentLatLng, loading } = useData();

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

  // Find the closest halt to current location
  let closestHaltIndex = -1;
  if (currentLatLng && selectedRoute.haltList.length > 0) {
    let minDistance = Infinity;
    selectedRoute.haltList.forEach((halt, index) => {
      if (halt.latLng) {
        const distance = currentLatLng.distanceTo(halt.latLng);
        if (distance < minDistance) {
          minDistance = distance;
          closestHaltIndex = index;
        }
      }
    });
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={1}>
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
          {selectedRoute.haltList.map((halt, index) => {
            const isClosest = index === closestHaltIndex;
            return (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  {index > 0 && <TimelineConnector />}
                  <TimelineDot color={isClosest ? "primary" : "grey"}>
                    <PlaceIcon fontSize="small" />
                  </TimelineDot>
                  {index < selectedRoute.haltList.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: isClosest ? "bold" : "normal",
                    backgroundColor: isClosest ? "action.hover" : "transparent",
                    borderRadius: 1,
                  }}
                >
                  <HaltLink halt={halt} />
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Box>
    </Box>
  );
}
