import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HailIcon from "@mui/icons-material/Hail";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatArrival } from "../../nonview/base/Duration";
import HaltInfo from "../atoms/HaltInfo";

export default function BusPage() {
  const { selectedBus, loading } = useData();
  const now = useClock();
  const nextHaltRef = useRef(null);
  const [nextHaltIndex, setNextHaltIndex] = useState(-1);

  // Compute per-halt arrivals and find the next halt index
  const haltArrivals =
    selectedBus && !loading
      ? selectedBus.route.haltList.map((halt) => ({
          halt,
          arrivalMs: halt.latLng
            ? selectedBus.nextArrivalAt(halt.latLng, now)
            : null,
        }))
      : [];

  useEffect(() => {
    if (haltArrivals.length === 0) return;
    let minMs = Infinity;
    let idx = -1;
    haltArrivals.forEach(({ arrivalMs }, i) => {
      if (arrivalMs !== null && arrivalMs < minMs) {
        minMs = arrivalMs;
        idx = i;
      }
    });
    setNextHaltIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBus, now]);

  // Smooth-scroll to the next halt
  useEffect(() => {
    if (nextHaltRef.current && nextHaltIndex >= 0) {
      setTimeout(() => {
        nextHaltRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [nextHaltIndex]);

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

  if (!selectedBus) {
    return (
      <Box p={3}>
        <Typography variant="h5">Bus not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={1}>
        {/* Full halt timeline */}
        <Timeline
          position="right"
          sx={{
            padding: 0,
            margin: 0,
            "& .MuiTimelineItem-root": { "&:before": { display: "none" } },
          }}
        >
          {(() => {
            // Determine "at halt" state in render (depends on `now`)
            const atHalt = selectedBus ? selectedBus.currentHalt(now) : null;
            const atHaltIndex = atHalt
              ? haltArrivals.findIndex(({ halt }) => halt.id === atHalt.id)
              : -1;
            // baseIndex: all halts before this are "passed"
            const baseIndex = atHaltIndex >= 0 ? atHaltIndex : nextHaltIndex;
            // effectiveNextIndex: highlight next upcoming halt after current
            const effectiveNextIndex =
              atHaltIndex >= 0 ? atHaltIndex + 1 : nextHaltIndex;

            return haltArrivals.map(({ halt, arrivalMs }, index) => {
              const isAtHalt = index === atHaltIndex;
              const isPassed = baseIndex >= 0 && index < baseIndex;
              const isNext = !isAtHalt && index === effectiveNextIndex;
              const isUpcoming = !isPassed && !isAtHalt;
              return (
                <TimelineItem
                  key={halt.id ?? index}
                  ref={isAtHalt || isNext ? nextHaltRef : null}
                >
                  <TimelineSeparator>
                    {index > 0 && <TimelineConnector />}
                    <TimelineDot
                      color={isAtHalt ? "success" : isNext ? "primary" : "grey"}
                      variant={isAtHalt || isNext ? "filled" : "outlined"}
                      sx={isPassed ? { opacity: 0.35 } : {}}
                    >
                      {isAtHalt ? (
                        <HailIcon fontSize="small" />
                      ) : isNext ? (
                        <AirportShuttleIcon fontSize="small" />
                      ) : (
                        <Box sx={{ width: 20, height: 20 }} />
                      )}
                    </TimelineDot>
                    {index < haltArrivals.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      py: 1,
                      backgroundColor: isAtHalt
                        ? "success.light"
                        : isNext
                          ? "action.hover"
                          : "transparent",
                      borderRadius: 1,
                      opacity: isPassed ? 0.35 : 1,
                    }}
                  >
                    <HaltInfo halt={halt} />
                    {isAtHalt && (
                      <Typography
                        variant="caption"
                        color="success.dark"
                        sx={{ fontWeight: 600, display: "block", mt: 0.25 }}
                      >
                        Boarding · Alighting
                      </Typography>
                    )}
                    {!isAtHalt && isUpcoming && arrivalMs !== null && (
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.25}>
                        <AccessTimeIcon sx={{ fontSize: 12 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {formatArrival(arrivalMs, now)}
                        </Typography>
                      </Box>
                    )}
                  </TimelineContent>
                </TimelineItem>
              );
            });
          })()}
        </Timeline>
      </Box>
    </Box>
  );
}
