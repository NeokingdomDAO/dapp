import { useRouter } from "next/router";
import useSWR from "swr";

import { useEffect } from "react";

import { fetcher } from "@lib/net";
import { User } from "@lib/userFactory";

export default function useUser({ redirectTo = "", redirectIfFound = false, shouldSkip = false } = {}) {
  const { data: user, mutate: mutateUser, isLoading } = useSWR<User>(!shouldSkip ? "/api/user" : null, fetcher);
  const router = useRouter();

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo, router]);

  return { user, mutateUser, isLoading };
}
