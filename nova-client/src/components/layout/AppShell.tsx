
import * as React from "react";
import {
  Home,
  BookHeart,
  Smile,
  Target,
  CalendarDays,
  Images,
  MessageCircle,
  Mic,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  CheckSquare,
  FolderOpen,
  NotebookPen,
  Sparkles,
  Wallet,
  Luggage,
  BrainCircuit,
} from "lucide-react";
import { GradientBackground } from "../shared/GradientBackground";
import { Sidebar, type SidebarNavGroup } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MobileNavigation } from "./MobileNavigation";
import { FloatingActionButton } from "../buttons/FloatingActionButton";
import { CommandPalette, type CommandItem } from "../overlays/CommandPalette";
import { useDisclosure } from "@/hooks/use-disclosure";
import type { NotificationItem } from "../user/NotificationCenter";
import type { Space } from "../navigation/ProjectSwitcher";
import { href } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { logOut } from "@/services/auth";

export interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
  activeRoute: string;
  onNavigate: (route: string) => void;
  quickActions?: React.ReactNode;
  notifications?: NotificationItem[];
  userName?: string;
  userEmail?: string;
  onQuickAdd?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
  onSignOut?: () => void;
}

const NAV_ROUTES = [
  {
    id: "today",
    label: "Today",
    icon: <Home className="h-[18px] w-[18px]" />,
    href:"/today"

  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <CalendarDays className="h-[18px] w-[18px]" />,
    href:"/calendar"

  },
  {
    id: "tasks",
    label: "Tasks",
    icon: <CheckSquare className="h-[18px] w-[18px]" />,
    href:"/add-task"
  },
  {
    id: "goals",
    label: "Goals",
    icon: <Target className="h-[18px] w-[18px]" />,
    href:"/goals"
  },
  {
    id: "notes",
    label: "Notes",
    icon: <NotebookPen className="h-[18px] w-[18px]" />,
    href:"/notes"
  
  },
 
  {
    id: "finance",
    label: "Finance",
    icon: <Wallet className="h-[18px] w-[18px]" />,
    href:"/finance"


  },
  {
    id: "assistant",
    label: "AI Assistant",
    icon: <Sparkles className="h-[18px] w-[18px]" />,
    href:"/assistant"
  
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FolderOpen className="h-[18px] w-[18px]" />,
    href:"/documents"
  
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon className="h-[18px] w-[18px]" />,
    href:"/settings"

  },
  {
    id: "travel_planner",
    label: "Travel Planner",
    icon: <Luggage className="h-[18px] w-[18px]" />,
    href:"/travel-planner"

  },
]

const DEFAULT_SPACES: Space[] = [
  { id: "personal", name: "Personal" },
  { id: "family", name: "Family" },
  { id: "work", name: "Work" },
];

/**
 * The root shell every Nova page mounts into:
 *   <AppShell><PageContainer>...</PageContainer></AppShell>
 * Owns the sidebar, header, mobile nav, command palette, FAB, and ambient
 * background so individual pages never think about chrome.
 */
export function AppShell({
  children,
  pageTitle,
  activeRoute,
  onNavigate,
  quickActions,
  notifications = [],
  userName = "Alex",
  userEmail,
  onQuickAdd,
  onSettings,
  onProfile,
  onSignOut,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeSpace, setActiveSpace] = React.useState(DEFAULT_SPACES[0].id);
  const mobileDrawer = useDisclosure();
  const palette = useDisclosure();

  const user=useAppSelector(state=>state.auth).user

  const getNavItem = (id: string) => {
  const route = NAV_ROUTES.find((r) => r.id === id)!;

  return {
    icon: route.icon,
    label: route.label,
    active: activeRoute === route.id,
    onClick: () => onNavigate(route.id),
    href: route.href,
  };
};

const groups: SidebarNavGroup[] = [
  {
    label: "Daily",
    items: [
      getNavItem("today"),
      getNavItem("calendar"),
      getNavItem("tasks"),
      getNavItem("goals"),
    ],
  },
  {
    label: "Workspace",
    items: [
      getNavItem("notes"),
      getNavItem("documents"),
      getNavItem("finance"),
    ],
  },
  {
    label: "Explore",
    items: [
      getNavItem("travel_planner"),
      getNavItem("assistant"),
    ],
  },
  {
    label: "System",
    items: [
      getNavItem("settings"),
    ],
  },
];

  const allItems = NAV_ROUTES.map((r) => ({
    icon: r.icon,
    label: r.label,
    active: activeRoute === r.id,
    onClick: () => onNavigate(r.id),
  }));

  const mobileTabs = NAV_ROUTES.slice(0, 4).map((r) => ({
    icon: r.icon,
    label: r.label,
    active: activeRoute === r.id,
    onClick: () => onNavigate(r.id),
  }));

  const commandItems: CommandItem[] = NAV_ROUTES.map((r) => ({
    id: r.id,
    label: `Go to ${r.label}`,
    icon: r.icon,
    onSelect: () => onNavigate(r.id),
  }));

  const onLogout=()=>{
    logOut()
  }

  return (
    <div className="relative min-h-screen">
      <GradientBackground />

      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 pt-4 md:px-6">
        <Sidebar
          groups={groups}
          spaces={DEFAULT_SPACES}
          activeSpaceId={activeSpace}
          onSpaceChange={setActiveSpace}
          onSearchOpen={palette.onOpen}
          userName={user?.name}
          userSubtitle={user?.email}
          onProfileClick={onProfile}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />

        <div className="min-w-0 flex-1">
          <TopHeader
            pageTitle={pageTitle}
            quickActions={quickActions}
            notifications={notifications}
            userName={user?.name}
            userEmail={user?.email}
            onMobileMenuClick={mobileDrawer.onOpen}
            onSettings={onSettings}
            onProfile={onProfile}
            onSignOut={onLogout}
          />
          <main>{children}</main>
        </div>
      </div>

      <MobileNavigation
        tabs={mobileTabs}
        allItems={allItems}
        drawerOpen={mobileDrawer.isOpen}
        onDrawerClose={mobileDrawer.onClose}
      />

      {onQuickAdd && (
        <FloatingActionButton
          icon={<Plus className="h-6 w-6" />}
          label="Quick add"
          onClick={onQuickAdd}
          className="bottom-24 md:bottom-8"
        />
      )}

      <CommandPalette items={commandItems} isOpen={palette.isOpen} onOpenChange={(o) => (o ? palette.onOpen() : palette.onClose())} />
    </div>
  );
}
