import {
  DashboardOutlined,
  FireOutlined,
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
    navigate("/auth/login", { replace: true });
  };

  return (
    <Layout className="wt-app-shell min-h-screen">
      <Sider
        className="wt-sider"
        breakpoint="lg"
        collapsed={collapsed}
        collapsedWidth={0}
        collapsible
        onBreakpoint={setCollapsed}
        onCollapse={setCollapsed}
        trigger={null}
      >
        <div className="flex min-h-20 items-center gap-3 border-b border-[rgba(38,49,61,0.78)] px-4">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(182,255,59,0.28)] bg-[rgba(182,255,59,0.1)] text-[var(--wt-primary)] shadow-[0_0_24px_rgba(182,255,59,0.08)]"
          >
            <FireOutlined className="text-xl" />
          </div>
          <div className="min-w-0">
            <Title level={4} className="!m-0 !text-[var(--wt-text)]">
              Workout Tracker
            </Title>
            <p className="m-0 truncate text-[13px] font-medium leading-5 text-[var(--wt-text-subtle)]">
              Training console
            </p>
          </div>
        </div>

        <Menu
          className="wt-main-menu"
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>

      <Layout className="bg-transparent">
        <Header className="flex min-h-16 items-center justify-between gap-2 border-b border-[rgba(38,49,61,0.78)] !bg-[rgba(13,17,23,0.92)] !px-4 backdrop-blur sm:gap-4 md:!px-6 lg:min-h-20">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              aria-label={collapsed ? "Open navigation" : "Close navigation"}
              className="wt-shell-button"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((current) => !current)}
              type="text"
            />
            <div className="min-w-0">
              <Title
                className="!m-0 truncate !text-base !font-bold !text-[var(--wt-text)] sm:!text-xl"
                level={4}
              >
                Workout Management
              </Title>
              <p className="m-0 hidden truncate text-[13px] font-medium leading-5 text-[var(--wt-text-subtle)] sm:block">
                Plan, track, and review training work
              </p>
            </div>
          </div>

          <Button
            className="wt-logout-button shrink-0"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </Header>

        <Content className="min-w-0 bg-transparent px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="wt-content-panel mx-auto min-h-[calc(100dvh-8rem)] w-full max-w-[1280px] rounded-xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
