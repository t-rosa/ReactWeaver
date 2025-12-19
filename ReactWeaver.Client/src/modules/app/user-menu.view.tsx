import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, ItemActions, ItemContent, ItemMedia } from "@/components/ui/item";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/modules/auth/authorize/authorize.hooks";
import { Authorize } from "@/modules/auth/authorize/authorize.view";
import { LogoutView } from "@/modules/auth/logout.view";
import { DotsThreeVerticalIcon, ShieldIcon, UserCircleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

export function UserMenu() {
  const { isMobile } = useSidebar();
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton disabled={user === null} size="lg" />}>
            <Item size="xs">
              <ItemMedia>
                <Avatar>
                  <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="truncate">{user.email}</ItemContent>
              <ItemActions>
                <DotsThreeVerticalIcon />
              </ItemActions>
            </Item>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <Item size="xs">
                  <ItemMedia>
                    <Avatar>
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent className="truncate">{user?.email}</ItemContent>
                </Item>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <UserCircleIcon />
                Profile
              </DropdownMenuItem>
              <Authorize role="Admin">
                <DropdownMenuItem nativeButton={false} render={<Link to="/admin" />}>
                  <ShieldIcon />
                  Administration
                </DropdownMenuItem>
              </Authorize>
              <DropdownMenuSeparator />
              <LogoutView />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
