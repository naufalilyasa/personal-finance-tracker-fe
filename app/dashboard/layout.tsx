"use client";
import { Layout, Typography, Space, Button, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";

const { Header, Content } = Layout;
const { Title } = Typography;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // User dropdown menu items
  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  // Navigation menu items
  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/transactions",
      icon: <TransactionOutlined />,
      label: "Transactions",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  return (
    <ProtectedRoute>
      <Layout className="min-h-screen">
        <Header className="bg-white! px-6 shadow-md flex items-center gap-6">
          <Title level={3} className="m-0 whitespace-nowrap">
            Personal Finance Tracker
          </Title>

          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="flex-1 min-w-0 border-none"
          />

          <div className="ml-auto flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button icon={<UserOutlined />}>{user?.name}</Button>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
