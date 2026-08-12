import { Suspense } from "react";
import AcceptInviteClient from "./accept-invite-client";

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AcceptInviteClient />
    </Suspense>
  );
}
