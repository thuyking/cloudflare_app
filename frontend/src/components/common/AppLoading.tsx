import { Spin } from "antd";
import type { ReactNode } from "react";

interface AppLoadingProps {
  children?: ReactNode;
  spinning: boolean;
  tip?: string;
}

export default function AppLoading({
  children,
  spinning,
  tip = "Loading...",
}: AppLoadingProps) {
  if (children) {
    return (
      <Spin spinning={spinning} tip={tip}>
        {children}
      </Spin>
    );
  }

  return (
    <div className="flex min-h-40 items-center justify-center">
      <Spin spinning={spinning} tip={tip} />
    </div>
  );
}
