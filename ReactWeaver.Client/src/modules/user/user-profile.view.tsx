import { Container } from "#/components/container.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#/components/ui/breadcrumb.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "#/components/ui/item.tsx";
import {
  getCurrentUserQueryKey,
  uploadAvatarMutation,
} from "#/lib/api/@tanstack/react-query.gen.ts";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useUser } from "../auth/authorize/authorize.hooks";
import { AppHeader as UserHeader } from "./components/user-header";
import { AppInset as UserInset } from "./components/user-inset";

export function UserProfileView() {
  const { user } = useUser();
  const ref = React.useRef<HTMLInputElement>(null);

  const upload = useMutation({
    ...uploadAvatarMutation(),
    onSuccess(data) {
      console.log(data);
    },
    onError(data) {
      console.log(data);
    },
    meta: {
      invalidatesQuery: getCurrentUserQueryKey(),
    },
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;

    upload.mutate({
      body: { file },
    });
  }

  return (
    <UserInset>
      <UserHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>Profile</BreadcrumbLink>
        </BreadcrumbItem>
      </UserHeader>
      <Container>
        <ItemGroup>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
              <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
            <Badge variant={user.isEmailConfirmed ? "secondary" : "outline"}>
              {user.isEmailConfirmed ? "Verified" : "Unverified"}
            </Badge>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Roles</ItemTitle>
              <ItemDescription>The roles assigned to your account.</ItemDescription>
            </ItemContent>
            {user.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Avatar</ItemTitle>
              <ItemDescription>Upload a new profile picture.</ItemDescription>
            </ItemContent>
            <ItemActions
              onClick={() => {
                const input = ref.current;
                if (!input) return;
                input.click();
              }}
            >
              <Input
                ref={ref}
                type="file"
                aria-hidden
                className="sr-only hidden"
                onChange={handleChange}
              />
              <Avatar>
                {user.avatar && <AvatarImage src={user.avatar} alt={user.email} />}
                <AvatarFallback>{user.email.at(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </ItemActions>
          </Item>
        </ItemGroup>
      </Container>
    </UserInset>
  );
}
