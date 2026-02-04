import { Box, CircularProgress } from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import HaltLink from "../moles/HaltLink";

export default function HaltsPage() {
  const { halts, routes, loading } = useData();

  // Filter halts to only show those associated with at least one route
  const filteredHalts = halts.filter((halt) =>
    routes.some((route) => route.hasHalt(halt)),
  );

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

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={2}>
        {filteredHalts.map((halt) => (
          <HaltLink key={halt.name} halt={halt} />
        ))}
      </Box>
    </Box>
  );
}
