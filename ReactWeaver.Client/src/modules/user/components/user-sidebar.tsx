import { LanguageSwitcher } from "#src/components/language-switcher.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "#src/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import { Item, ItemContent, ItemMedia } from "#src/components/ui/item.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#src/components/ui/sidebar.tsx";
import { useUser } from "#src/modules/auth/authorize/authorize.hooks.tsx";
import { Authorize } from "#src/modules/auth/authorize/authorize.view.tsx";
import { LogoutView } from "#src/modules/auth/logout.view.tsx";
import { m } from "#src/paraglide/messages.js";
import {
  AppWindowIcon,
  ChartPieSliceIcon,
  CommandIcon,
  DotsThreeVerticalIcon,
  LifebuoyIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { ThemeSwitcher } from "../../theme-switcher/theme-switcher.view";

interface NavItem {
  label: () => string;
  url: string;
  icon: React.JSX.Element;
}

interface Data {
  navMain: NavItem[];
  navSecondary: NavItem[];
}

const data: Data = {
  navMain: [],
  navSecondary: [
    {
      label: () => m.nav_support(),
      url: "#",
      icon: <LifebuoyIcon />,
    },
    {
      label: () => m.nav_feedback(),
      url: "#",
      icon: <PaperPlaneTiltIcon />,
    },
  ],
};

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <CommandIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{m.app_name()}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {m.nav_application()}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  render={<Link to={item.url} activeProps={{ className: "bg-muted" }} />}
                >
                  {item.icon}
                  <span>{item.label()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.url + item.label()}>
              <SidebarMenuButton size="sm" render={<a href={item.url} />}>
                {item.icon}
                <span>{item.label()}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <LanguageSwitcher />
          <ThemeSwitcher />
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar>
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.email} />}
                  <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="truncate">{user.email}</p>
                <DotsThreeVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent side={isMobile ? "bottom" : "right"}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <Item size="xs">
                      <ItemMedia>
                        <Avatar>
                          {user.avatar && <AvatarImage src={user.avatar} alt={user.email} />}
                          <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent className="truncate">{user?.email}</ItemContent>
                    </Item>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Authorize role="Admin">
                    <DropdownMenuItem nativeButton={false} render={<Link to="/admin/dashboard" />}>
                      <ChartPieSliceIcon />
                      {m.nav_administration()}
                    </DropdownMenuItem>
                  </Authorize>
                  <DropdownMenuItem nativeButton={false} render={<Link to="/app/dashboard" />}>
                    <AppWindowIcon />
                    {m.nav_application()}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutView />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
