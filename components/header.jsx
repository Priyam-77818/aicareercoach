"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex justify-end p-4">
      {!isSignedIn ? (
        <SignInButton mode="modal" />
      ) : (
        <UserButton afterSignOutUrl="/" />
      )}
    </div>
  );
};

export default Header;