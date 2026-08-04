import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you opened does not exist."
      extra={
        <Link to="/dashboard">
          <Button type="primary">Back to dashboard</Button>
        </Link>
      }
    />
  );
}
