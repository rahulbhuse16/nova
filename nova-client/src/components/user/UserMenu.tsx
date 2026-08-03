
import * as React from "react";
import { Settings, LogOut, Moon, Sun, User } from "lucide-react";
import { Avatar } from "./Avatar";
import { Dropdown } from "../overlays/Dropdown";
import { Divider } from "../shared/Divider";
import { useTheme } from "@/lib/theme";

export interface UserMenuProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  onSettings?: () => void;
  onProfile?: () => void;
  onSignOut?: () => void;
}

export function UserMenu({ name, email, avatarSrc, onSettings, onProfile, onSignOut }: UserMenuProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Dropdown
      align="right"
      trigger={
        <button className="flex items-center gap-2 rounded-pill p-1 pr-3 transition-colors hover:bg-surface">
          <Avatar name={name} src={avatarSrc} size="sm" status="online" />
          <span className="hidden text-sm font-medium text-text md:block">{name}</span>
        </button>
      }
    >
      <div className="w-64 p-2 bg-black/40">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={name} src={avatarSrc} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">{name}</p>
            {email && <p className="truncate text-xs text-muted">{email}</p>}
          </div>
        </div>
        <Divider className="my-2" />
        {/* <MenuButton icon={<User className="h-4 w-4" />} label="Your profile" onClick={onProfile} />
        <MenuButton icon={<Settings className="h-4 w-4" />} label="Settings" onClick={onSettings} />
        <MenuButton
          icon={theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          label={theme === "dark" ? "Light mode" : "Dark mode"}
          onClick={toggleTheme}
        /> */}
        <MenuButton icon={<LogOut className="h-4 w-4" />} label="Sign out" onClick={onSignOut} tone="danger" />
      </div>
    </Dropdown>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-surface ${
        tone === "danger" ? "text-error" : "text-text"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
