import { Box, Divider, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useData } from "../../nonview/contexts/DataContext";

export default function UserProfilePage() {
  const { user, rideHistory, ride } = useData();

  if (!user) return null;

  const totalRides = rideHistory.length + (ride ? 1 : 0);
  const totalSpent = rideHistory.reduce((sum, r) => sum + r.fare, 0);

  const rows = [
    { icon: <PersonIcon fontSize="small" color="action" />, label: "Name", value: user.name },
    { icon: <HomeIcon fontSize="small" color="action" />, label: "Address", value: user.address },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" color="action" />,
      label: "Balance",
      value: `LKR ${user.cashBalance.toFixed(2)}`,
    },
    {
      icon: <DirectionsBusIcon fontSize="small" color="action" />,
      label: "Rides",
      value: `${totalRides} ride${totalRides !== 1 ? "s" : ""} · LKR ${totalSpent.toFixed(2)} spent`,
    },
  ];

  return (
    <Box sx={{ px: 2, py: 1, overflow: "auto", height: "100%" }}>
      {rows.map(({ icon, label, value }, i) => (
        <Box key={label}>
          {i > 0 && <Divider />}
          <Box display="flex" alignItems="flex-start" gap={1.5} py={1.25}>
            <Box sx={{ mt: 0.25, flexShrink: 0 }}>{icon}</Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {label}
              </Typography>
              <Typography variant="body2">{value}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
