import { Box } from "@mui/material";

/**
 * Standard layout shell for all drawer views.
 * - `subheader`: optional sticky content rendered above the scroll area
 *   (e.g. a count caption, distance chip, etc.)
 * - `children`: scrollable body content
 */
export default function DrawerPage({ subheader, children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {subheader && (
        <Box
          sx={{
            px: 2,
            pt: 1,
            pb: 0.75,
            flexShrink: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {subheader}
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: "auto" }}>{children}</Box>
    </Box>
  );
}
