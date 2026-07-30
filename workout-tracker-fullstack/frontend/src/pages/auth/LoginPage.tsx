import { Button, Card, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import type { LoginPayload } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title, Paragraph } = Typography;

interface LoginLocationState {
  from?: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginPayload>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const from = locationState?.from ?? "/";

  const handleSubmit = async (values: LoginPayload) => {
    try {
      setIsSubmitting(true);
      await login(values);
      messageApi.success("Login successful.");
      navigate(from, { replace: true });
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Login failed. Please check your email and password."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-3 py-6 sm:px-4 sm:py-10">
      {contextHolder}
      <Card className="w-full max-w-md shadow-sm">
        <Title className="text-center" level={2}>
          Login
        </Title>
        <Paragraph className="text-center text-gray-500">
          Sign in to continue tracking your workouts.
        </Paragraph>

        <Form<LoginPayload>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item<LoginPayload>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input autoComplete="email" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item<LoginPayload>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                block
                htmlType="submit"
                loading={isSubmitting}
                type="primary"
              >
                Login
              </Button>
            )}
          </Form.Item>
        </Form>

        <Paragraph className="mb-0 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </Paragraph>
      </Card>
    </main>
  );
}
