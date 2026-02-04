import { Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const params = useParams();
  const hasPannedRef = useRef(false);

  // Find the closest halt to current location
  let closestHaltIndex = -1;
  let closestHaltId = null;
  if (currentLatLng && selectedRoute && selectedRoute.haltList.length > 0) {
    let minDistance = Infinity;
    selectedRoute.haltList.forEach((halt, index) => {
      if (halt.latLng) {
        const distance = currentLatLng.distanceTo(halt.latLng);
        if (distance < minDistance) {
          minDistance = distance;
          closestHaltIndex = index;
          closestHaltId = halt.id;
        }
      }
    });
  }

  // Pan to closest halt when page opens or when closest halt changes
  useEffect(() => {
    if (selectedRoute && closestHaltId && !hasPannedRef.current) {
      const closestHalt = selectedRoute.haltList.find(
        (h) => h.id === closestHaltId,
      );
      if (closestHalt && closestHalt.latLng) {
        const newLatLng = closestHalt.latLng.toString();
        navigate(`/${newLatLng}/route/${params.routeId}`, { replace: true });
        hasPannedRef.current = true;
      }
    }
  }, [closestHaltId, selectedRoute, navigate, params.routeId]);

  // Reset hasPannedRef when route changes
  useEffect(() => {
    hasPannedRef.current = false;
  }, [params.routeId]);

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
