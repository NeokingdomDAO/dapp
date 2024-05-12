// import { useChain, useWallet } from "@cosmos-kit/react";
// import { useEffect } from "react";
// import { Alert, Button, Grid } from "@mui/material";
// import IBCBalanceCrescent from "@components/ibc/IBCBalanceCrescent";
// import IBCBalanceEvmos from "@components/ibc/IBCBalanceEvmos";
import { Alert } from "@mui/material";

export default function IBC() {
  return <Alert severity="warning">Feature momentarily unavailable.</Alert>;
}

// export default function IBC() {
//   const {
//     wallet: evmosWallet,
//     username: evmosAccountName,
//     connect: connectEvmosWallet,
//     disconnect: disconnectEvmosWallet,
//   } = useChain("evmos");

//   const { connect: connectCrescentWallet, disconnect: disconnectCrescentWallet } = useChain("crescent");

//   const { status: walletStatus, mainWallet, message } = useWallet();

//   useEffect(() => {
//     const fn = async () => {
//       await mainWallet?.connect();
//     };
//     fn();
//   }, [mainWallet]);

//   if (walletStatus === "Disconnected" || walletStatus === "NotExist") {
//     return (
//       <Alert
//         severity="info"
//         action={
//           <Button
//             size="small"
//             variant="outlined"
//             onClick={() => {
//               connectEvmosWallet();
//               connectCrescentWallet();
//             }}
//           >
//             Connect Wallet
//           </Button>
//         }
//         sx={{ mb: 2 }}
//       >
//         Please connect your Wallet
//       </Alert>
//     );
//   }

//   if (walletStatus === "Connecting") {
//     return (
//       <Alert sx={{ width: "100%" }} severity="info">
//         Connecting to your wallet...
//       </Alert>
//     );
//   }

//   if (walletStatus === "Error") {
//     return (
//       <Alert sx={{ width: "100%" }} severity="error">
//         Error connecting to your wallet: {message}
//       </Alert>
//     );
//   }

//   if (walletStatus === "Connected") {
//     return (
//       <>
//         <Alert
//           severity="info"
//           action={
//             <Button
//               size="small"
//               variant="outlined"
//               onClick={() => {
//                 disconnectEvmosWallet();
//                 disconnectCrescentWallet();
//               }}
//             >
//               Disconnect Wallet
//             </Button>
//           }
//           sx={{ mb: 2 }}
//         >
//           You&apos;re connected to <strong>{evmosWallet?.prettyName} Wallet</strong>. Account Name:{" "}
//           <strong>{evmosAccountName}</strong>.
//         </Alert>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <IBCBalanceEvmos />
//           </Grid>
//           <Grid item xs={12}>
//             <IBCBalanceCrescent />
//           </Grid>
//         </Grid>
//       </>
//     );
//   }
// }
