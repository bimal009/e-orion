import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <main className=" bg-transparent ">{children}</main>;
};

export default layout;
