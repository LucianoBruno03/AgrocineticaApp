import React, { Fragment } from "react";

type Props = {
  children: React.ReactNode;
};

const GlobalSafeAreaView = ({ children }: Props) => {
  return <Fragment>{children}</Fragment>;
};

export default GlobalSafeAreaView;
