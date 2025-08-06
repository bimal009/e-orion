import PointTableList from "@/components/dashboard/point table/PointTableList";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="tournaments-page mx-auto py-6 px-4 max-w-7xl">
      <PointTableList tournmentId={id} />
    </div>
  );
};

export default page;
