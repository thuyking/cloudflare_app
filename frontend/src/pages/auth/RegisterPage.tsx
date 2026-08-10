import { Button, Card, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import type { RegisterPayload } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title, Paragraph } = Typography;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterPayload) => {
    try {
      setIsSubmitting(true);
      await register(values);
      messageApi.success("Register successful. Please login.");
      navigate("/auth/login", { replace: true });
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Register failed. Please check your information."),
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
          Register
        </Title>
        <Paragraph className="text-center text-gray-500">
          Create an account to start tracking your workouts.
        </Paragraph>

        <Form<RegisterPayload>
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item<RegisterPayload>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name." }]}
          >
            <Input autoComplete="name" placeholder="Your name" />
          </Form.Item>

          <Form.Item<RegisterPayload>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input autoComplete="email" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item<RegisterPayload>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password
              autoComplete="new-password"
              placeholder="Create a password"
            />
          </Form.Item>

          <Form.Item>
            <Button block htmlType="submit" loading={isSubmitting} type="primary">
              Register
            </Button>
          </Form.Item>
        </Form>

        <Paragraph className="mb-0 text-center">
          Already have an account? <Link to="/auth/login">Login</Link>
        </Paragraph>
      </Card>
    </main>
  );
}
