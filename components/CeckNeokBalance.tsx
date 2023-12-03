import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

import DepositTokens from "./tokens/DepositTokens";

export default function CheckNeokBalance() {
  const { data: userBalanceData } = useUserBalanceAndOffers();

  const hasNeokWhitelisted = (userBalanceData?.balance.neokTokens || 0) > 0;

  return hasNeokWhitelisted ? <DepositTokens /> : null;
}
