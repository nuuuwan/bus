import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import HaltLink from "../moles/HaltLink";
import DrawerPage from "../moles/DrawerPage";

export default function RoutePage() {
  const { selectedRoute, buses, currentLatLng, loading } = useData();
  const now = useClock();
  const closestHaltRef = useRef(null);
  const [closestHaltIndex, setClosestHaltIndex] = useState(-1);

  // Find the closest halt to current location
  useEffect(() => {
    if (currentLatLng && selectedRoute && selectedRoute.haltList.length > 0) {
      let minDistance = Infinity;
      let closestIndex = -1;
      selectedRoute.haltList.forEach((halt, index) => {
        if (halt.latLng) {
          const distance = currentLatLng.distanceTo(halt.latLng);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });
      setClosestHaltIndex(closestIndex);
    }
  }, [currentLatLng, selectedRoute]);

  // Scroll to closest halt when it changes
  useEffect(() => {
    if (closestHaltRef.current && closestHaltIndex >= 0) {
      setTimeout(() => {
        closestHaltRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [closestHaltIndex]);

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
    <DrawerPage
      subheader={
        <Chip
          icon={<AirportShuttleIcon />}
          label={`${buses.filter((b) => b.route.id === selectedRoute.id).length} buses`}
          size="small"
          variant="outlined"
        />
      }
    >
      <Box p={1}>
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

            // Find the bus on this route arriving soonest at this halt
            const routeBuses = buses.filter(
              (b) => b.route.id === selectedRoute.id,
            );
            const nextBus =
              halt.latLng && routeBuses.length > 0
                ? routeBuses
                    .map((b) => ({
                      bus: b,
                      arrivalMs: b.nextArrivalAt(halt.latLng, now),
                    }))
                    .sort((a, b) => a.arrivalMs - b.arrivalMs)[0]
                : null;
            return (
              <TimelineItem key={index} ref={isClosest ? closestHaltRef : null}>
                <TimelineSeparator>
                  {index > 0 && <TimelineConnector />}
                  <TimelineDot color={isClosest ? "primary" : "grey"}>
                    <StopCircleIcon fontSize="small" />
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
                  <HaltLink halt={halt} nextBus={nextBus} />
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Box>
    </DrawerPage>
  );
}
