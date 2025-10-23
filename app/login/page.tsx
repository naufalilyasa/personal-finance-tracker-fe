"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/use-auth";
import { useNotificationContext } from "@/hooks/use-notification";
import SpinLoading from "@/components/spin-loading";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const { openNotificationWithIcon } = useNotificationContext();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const onLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);

    if (result.success) {
      message.success("Login successful!");
      router.push("/");
      openNotificationWithIcon("success", "Login successful!", "");
      router.refresh();
    } else {
      message.error(result.error || "Login failed");
    }
  };

  if (isLoading) {
    return <SpinLoading />;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600 mt-2">Login to manage your finances</p>
        </div>

        <Form
          name="login"
          onFinish={onLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Login
            </Button>
          </Form.Item>

          <div className="text-sm text-gray-500 text-center mb-4">
            Demo: john@example.com / password123
          </div>

          <div className="text-center">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
