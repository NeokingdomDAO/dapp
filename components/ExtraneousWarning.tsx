import { useAccount } from "wagmi";

import { Alert, Button, Container } from "@mui/material";

import { getDaoManagerQuery } from "@graphql/queries/subgraph/get-dao-manager-query";
import { useSubgraphGraphQL } from "@graphql/subgraph";

import useLogout from "@hooks/useLogout";
import useResolutionsAcl from "@hooks/useResolutionsAcl";

export default function ExtraneousWarning({ children }: { children: React.ReactNode }) {
  const { acl, isLoading } = useResolutionsAcl();
  const { isConnected, address, isConnecting } = useAccount();
  const { data, isLoading: isLoadingGetDaoManager, error } = useSubgraphGraphQL(address ? getDaoManagerQuery : null);
  const { logout } = useLogout();

  if ((!isLoadingGetDaoManager && data?.daoManager === null) || error) {
    return (
      <Container maxWidth="lg" sx={{ mb: 6, mt: 1 }}>
        <Alert severity="error">
          There are indexing problems. This is probably due to evmos being down. The dev team will do an announcement on
          discord as soon as this will be fixed
        </Alert>
      </Container>
    );
  }

  if (
    !isLoading &&
    !isLoadingGetDaoManager &&
    acl?.isExtraneous &&
    isConnected &&
    !isConnecting &&
    address &&
    data?.daoManager
  ) {
    return (
      <>
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
            Please change your wallet account.
          </Alert>
        </Container>
      </>
    );
  }

  return children;
}
