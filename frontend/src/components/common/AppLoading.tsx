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
      <Spin
        className="wt-app-loading"
        spinning={spinning}
        tip={tip}
        wrapperClassName="wt-app-loading"
      >
        {children}
      </Spin>
    );
  }

  return (
    <div
      aria-busy={spinning}
      aria-live="polite"
      className="wt-app-loading flex min-h-40 items-center justify-center rounded-xl border border-[var(--wt-border)] bg-[var(--wt-surface)] p-6"
      role="status"
    >
      <Spin spinning={spinning} tip={tip} />
    </div>
  );
}
