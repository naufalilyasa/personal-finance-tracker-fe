"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/use-auth";
import { useNotificationContext } from "@/hooks/use-notification";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, user, isLoading } = useAuth();
  const { openNotificationWithIcon } = useNotificationContext();

  useEffect(() => {
    // Redirect jika user sudah login
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const onRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    const result = await register(values.name, values.email, values.password);
    setLoading(false);

    if (result.success) {
      message.success("Registration successful!");
      router.push("/");
      openNotificationWithIcon("success", "Registration successful!", "");
    } else {
      message.error(result.error || "Registration failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
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
          <p className="text-gray-600 mt-2">Create an account to get started</p>
        </div>

        <Form
          name="register"
          onFinish={onRegister}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

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
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
