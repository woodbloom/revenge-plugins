import { findByStoreName, findByProps } from "@vendetta/metro";

const RelationshipStore = findByStoreName("RelationshipStore");
const UserStore = findByStoreName("UserStore");
const RestAPI = findByProps("getAPIBaseURL", "get");

function avatarUrl(user) {
  if (user?.avatar) {
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=80`;
  }
  const fallbackIndex = user?.discriminator && user.discriminator !== "0"
    ? Number(user.discriminator) % 5
    : Number(BigInt(user?.id || "0") >> 22n) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
}

export function getFriends() {
  try {
    const ids = RelationshipStore?.getFriendIDs?.() || [];
    return ids
      .map(id => UserStore?.getUser?.(id))
      .filter(Boolean)
      .map(u => ({ id: u.id, username: u.username, avatarUrl: avatarUrl(u) }))
      .sort((a, b) => a.username.localeCompare(b.username));
  } catch {
    return [];
  }
}

export async function openDMChannel(userId) {
  if (!RestAPI?.post) throw new Error("Discord's internal API module wasn't found on this version.");
  const res = await RestAPI.post({ url: "/users/@me/channels", body: { recipient_id: userId } });
  const channelId = res?.body?.id;
  if (!channelId) throw new Error("Couldn't open a DM channel with that user.");
  return channelId;
}
