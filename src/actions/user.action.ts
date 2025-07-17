"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const exsistinUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  let user = await getUserByClerkId(clerkId);
  if (user) return user.id;

  await syncUser();

  user = await getUserByClerkId(clerkId);
  if (user) return user.id;

  throw new Error("User not found after sync");
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    // Get 3 random users excluding the current user and the users the current user is following
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId as string } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId as string,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
    return randomUsers;
  } catch (error) {
    console.error("Error fetching random users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    if (userId === targetUserId) throw new Error("Cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId as string,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId as string,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId as string,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: userId as string,
          },
        }),
      ]);
    }
    revalidatePath(`/`);
    return { success: true };
  } catch (error) {
    console.error("Error in toggleFollow", error);
    return { success: false, error: "Error in toggleFollow" };
  }
}
