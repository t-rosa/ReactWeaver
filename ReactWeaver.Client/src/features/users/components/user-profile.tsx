import { Avatar, AvatarFallback, AvatarImage } from "#src/components/ui/avatar.tsx";
import { Badge } from "#src/components/ui/badge.tsx";
import { Input } from "#src/components/ui/input.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "#src/components/ui/item.tsx";
import {
  getGetCurrentUserQueryKey,
  getUploadAvatarMutationOptions,
} from "#src/lib/api/endpoints/index.ts";
import { useUser } from "#src/lib/auth.ts";
import { m } from "#src/paraglide/messages.js";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";

export function UserProfile() {
  const { user } = useUser();
  const ref = React.useRef<HTMLInputElement>(null);

  const upload = useMutation({
    ...getUploadAvatarMutationOptions(),
    onSuccess(data) {
      console.log(data);
    },
    onError(data) {
      console.log(data);
    },
    meta: {
      invalidatesQuery: getGetCurrentUserQueryKey(),
    },
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;

    upload.mutate({
      data: { file },
    });
  }

  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{m.common_email()}</ItemTitle>
          <ItemDescription>{user.email}</ItemDescription>
        </ItemContent>
        <Badge variant={user.isEmailConfirmed ? "secondary" : "outline"}>
          {user.isEmailConfirmed ? m.general_verified() : m.general_unverified()}
        </Badge>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{m.common_roles()}</ItemTitle>
          <ItemDescription>{m.general_roles_description()}</ItemDescription>
        </ItemContent>
        {user.roles.map((role) => (
          <Badge key={role} variant="secondary">
            {role}
          </Badge>
        ))}
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{m.general_avatar()}</ItemTitle>
          <ItemDescription>{m.general_avatar_description()}</ItemDescription>
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
  );
}
