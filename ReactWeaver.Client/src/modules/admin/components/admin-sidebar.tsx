import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/modules/admin/user-menu.view";
import { CodeSimpleIcon, WindIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher.view";

function Root(props: React.PropsWithChildren) {
  return (
    <Sidebar variant="floating" collapsible="icon">
      {props.children}
    </Sidebar>
  );
}

function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton>
          <CodeSimpleIcon />
          ReactWeaver
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function Content() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link
                className={sidebarMenuButtonVariants()}
                to="/users"
                activeProps={{ className: "bg-sidebar-accent font-bold" }}
              >
                <WindIcon />
                <span>Users</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function Footer() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <ThemeSwitcher />
        <SidebarMenuItem>
          <UserMenu />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export const AdminSidebar = Object.assign(Root, {
  Content,
  Header,
  Footer,
});
