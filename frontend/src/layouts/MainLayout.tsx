import {
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Typography } from "antd";
import { useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../contexts";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith("/workouts")) {
      return "/workouts";
    }

    if (location.pathname.startsWith("/plans")) {
      return "/plans";
    }

    return "/dashboard";
  }, [location.pathname]);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <NavLink to="/dashboard">Dashboard</NavLink>,
    },
    {
      key: "/workouts",
      icon: <UnorderedListOutlined />,
      label: <NavLink to="/workouts">Workouts</NavLink>,
    },
    {
      key: "/plans",
      icon: <ScheduleOutlined />,
      label: <NavLink to="/plans">Workout Plans</NavLink>,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsed={collapsed}
        collapsedWidth={0}
        collapsible
        onBreakpoint={setCollapsed}
        onCollapse={setCollapsed}
        trigger={null}
      >
        <div className="flex h-16 items-center justify-center px-3 text-center">
          <Title level={4} className="!m-0 !text-white">
            Workout Tracker
          </Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="flex min-h-16 items-center justify-between gap-2 !bg-white !px-3 shadow-sm sm:gap-4 md:!px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              aria-label={collapsed ? "Open navigation" : "Close navigation"}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((current) => !current)}
              type="text"
            />
            <Title className="!m-0 truncate !text-base sm:!text-xl" level={4}>
              Workout Management
            </Title>
          </div>

          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="shrink-0"
          >
            <span className="hidden sm:inline">Dang xuat</span>
          </Button>
        </Header>

        <Content className="m-2 min-w-0 rounded-lg bg-white p-3 sm:m-4 sm:p-4 md:m-6 md:p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
