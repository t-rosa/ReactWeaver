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
  CommandIcon,
  DotsThreeVerticalIcon,
  GridFourIcon,
  LifebuoyIcon,
  PaperPlaneTiltIcon,
  UserCircleIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher.view";

const data = {
  navMain: [
    {
      label: () => m.nav_dashboard(),
      url: "/admin/dashboard",
      icon: <GridFourIcon />,
    },
    {
      label: () => m.nav_users(),
      url: "/admin/users",
      icon: <UsersIcon />,
    },
  ],
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

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  {m.nav_administration()}
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
                  <DropdownMenuItem nativeButton={false} render={<Link to={"/user/profile"} />}>
                    <UserCircleIcon />
                    {m.nav_profile()}
                  </DropdownMenuItem>
                  <Authorize role="Admin">
                    <DropdownMenuItem nativeButton={false} render={<Link to="/app/dashboard" />}>
                      <AppWindowIcon />
                      {m.nav_application()}
                    </DropdownMenuItem>
                  </Authorize>
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
