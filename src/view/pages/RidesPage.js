import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { formatDuration } from "../../nonview/base/Duration";
import NumberPlate from "../atoms/NumberPlate";
import HaltInfo from "../atoms/HaltInfo";
import DrawerPage from "../moles/DrawerPage";

export default function RidesPage() {
  const { rideHistory, ride } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  const allRides = [...(ride ? [ride] : []), ...[...rideHistory].reverse()];

  if (allRides.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80%"
        gap={1}
      >
        <AirportShuttleIcon sx={{ fontSize: 40, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No rides yet
        </Typography>
      </Box>
    );
  }

  return (
    <DrawerPage
      subheader={
        <Typography variant="caption" color="text.secondary">
          {allRides.length} ride{allRides.length !== 1 ? "s" : ""}
        </Typography>
      }
    >
      <List sx={{ p: 0 }}>
        {allRides.map((r, i) => {
          const isActive = r.isActive;
          const ItemComponent = isActive ? ListItemButton : ListItem;
          return (
            <ItemComponent
              key={i}
              divider
              onClick={isActive ? () => navigate(`/${latLng}/ride`) : undefined}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                py: 1.5,
                px: 2,
                gap: 0.5,
              }}
            >
              {/* Bus */}
              <NumberPlate bus={r.bus} />

              {/* From → To */}
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                flexWrap="wrap"
                mt={0.25}
              >
                <HaltInfo halt={r.boardedAtHalt} />
                {r.alightedAtHalt && (
                  <>
                    <ArrowForwardIcon
                      sx={{ fontSize: 14, color: "text.secondary" }}
                    />
                    <HaltInfo halt={r.alightedAtHalt} />
                  </>
                )}
              </Box>

              {/* Duration + fare */}
              <Box display="flex" gap={2} mt={0.25}>
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(r.durationMs())}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  LKR {r.fare.toFixed(2)}
                </Typography>
                {r.isActive && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    Active
                  </Typography>
                )}
              </Box>
              <Divider />
            </ItemComponent>
          );
        })}
      </List>
    </DrawerPage>
  );
}
