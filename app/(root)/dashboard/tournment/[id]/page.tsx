import RoundList from "@/components/dashboard/rounds/RoundList";

import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <RoundList tournmentId={id} />
    </div>
  );
};

export default page;
