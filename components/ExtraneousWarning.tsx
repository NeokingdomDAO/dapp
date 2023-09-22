import { useAccount } from "wagmi";

import { Alert, Button, Container } from "@mui/material";

import useLogout from "@hooks/useLogout";
import useResolutionsAcl from "@hooks/useResolutionsAcl";

export default function ExtraneousWarning() {
  const { acl, isLoading } = useResolutionsAcl();
  const { isConnected, address, isConnecting } = useAccount();
  const { logout } = useLogout();

  if (!isLoading && acl?.isExtraneous && isConnected && !isConnecting && address) {
    return (
      <Container maxWidth="lg" sx={{ mb: 6, mt: 1 }}>
        <Alert
          severity="warning"
          action={
            <Button size="small" variant="outlined" onClick={() => logout()} sx={{ whiteSpace: "nowrap", ml: 2 }}>
              Log out
            </Button>
          }
        >
          The addess ({address}) of the wallet you&apos;re connected with is not part of the DAO users addresses.{" "}
        </Alert>
      </Container>
    );
  }
}
