import { useClerk, useUser } from "@clerk/nextjs";
import Loading from "./Loading";
import { ReactNode, useEffect } from "react";

export interface AuthProps {
  children?: ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { redirectToSignIn } = useClerk();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        redirectToSignIn();
      }
    }
  });

  if (!isLoaded || !isSignedIn) return <Loading />;
  return <>{children}</>;
}
