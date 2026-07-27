import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { Item, ItemContent, ItemMedia } from "#/components/ui/item.tsx";
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
} from "#/components/ui/sidebar.tsx";
import { useUser } from "#/modules/auth/authorize/authorize.hooks.tsx";
import { Authorize } from "#/modules/auth/authorize/authorize.view.tsx";
import { LogoutView } from "#/modules/auth/logout.view.tsx";
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
  name?: string;
  title?: string;
  url: string;
  icon: React.JSX.Element;
}

interface Data {
  navMain: NavItem[];
  navSecondary: NavItem[];
}

const data: Data = {
  navMain: [
    // {
    //   name: "Dashboard",
    //   url: "/app/dashboard",
    // icon: <GridFourIcon />,
    // },
    // {
    //   name: "Forecasts",
    //   url: "/app/forecasts",
    //   icon: <WindIcon />,
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifebuoyIcon />,
    },
    {
      title: "Feedback",
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
                <span className="truncate font-medium">React Weaver</span>
                <span className="truncate text-xs text-muted-foreground">Application</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  render={<Link to={item.url} activeProps={{ className: "bg-muted" }} />}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton size="sm" render={<a href={item.url} />}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
                      Administration
                    </DropdownMenuItem>
                  </Authorize>
                  <DropdownMenuItem nativeButton={false} render={<Link to="/app/dashboard" />}>
                    <AppWindowIcon />
                    Application
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
