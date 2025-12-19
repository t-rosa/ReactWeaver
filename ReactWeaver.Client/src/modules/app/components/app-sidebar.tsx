import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/modules/app/user-menu.view";
import { CodeSimpleIcon, WindIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher.view";

function Root(props: React.PropsWithChildren) {
  return (
    <div className="pattern hidden sm:block">
      <Sidebar variant="floating" collapsible="icon">
        {props.children}
      </Sidebar>
    </div>
  );
}

function Header() {
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="hover:bg-card">
            <CodeSimpleIcon />
            <span>ReactWeaver</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
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
              <SidebarMenuButton
                tooltip="Forecasts"
                render={
                  <Link
                    to="/forecasts"
                    activeProps={{
                      className: "bg-muted",
                    }}
                  />
                }
              >
                <WindIcon />
                <span>Forecasts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <ThemeSwitcher />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function Footer() {
  return (
    <SidebarFooter className="border-t">
      <UserMenu />
    </SidebarFooter>
  );
}

export const AppSidebar = Object.assign(Root, {
  Content,
  Header,
  Footer,
});
