import { Avatar, AvatarFallback } from "#src/components/ui/avatar.tsx";
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
import { SidebarMenuButton, useSidebar } from "#src/components/ui/sidebar.tsx";
import { useUser } from "#src/modules/auth/authorize/authorize.hooks.tsx";
import { Authorize } from "#src/modules/auth/authorize/authorize.view.tsx";
import { LogoutView } from "#src/modules/auth/logout.view.tsx";
import { m } from "#src/paraglide/messages.js";
import { DotsThreeVerticalIcon, UserCircleIcon, UsersIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

export function UserMenu() {
  const { isMobile } = useSidebar();
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
        <Avatar>
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
                  <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="truncate">{user?.email}</ItemContent>
            </Item>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <UserCircleIcon />
            {m.nav_profile()}
          </DropdownMenuItem>
          <Authorize role="Admin">
            <DropdownMenuItem nativeButton={false} render={<Link to="/admin/users" />}>
              <UsersIcon />
              {m.nav_users()}
            </DropdownMenuItem>
          </Authorize>
          <DropdownMenuSeparator />
          <LogoutView />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
