import { Spin } from "antd";

export default function SpinLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
