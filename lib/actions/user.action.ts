"use server";

import { db } from "@/db/db";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { question, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createUser(userParam: CreateUserParams) {
  try {
    const newUser = await db.insert(user).values({
      id: userParam.clerkId,
      name: userParam.name,
      userName: userParam.username,
      email: userParam.email,
      avatar: userParam.picture,
    });

    return newUser;
  } catch (error) {
    return {
      error: "Failed to create user",
    };
  }
}

export async function updateUser(userParam: UpdateUserParams) {
  try {
    await db
      .update(user)
      .set({
        id: userParam.clerkId,
        name: userParam.name,
        userName: userParam.username,
        email: userParam.email,
        avatar: userParam.picture,
      })
      .where(eq(user.id, userParam.clerkId));

    revalidatePath(userParam.path);
  } catch (error) {
    return {
      error: "Failed to update user",
    };
  }
}

export async function deleteUser(userParam: DeleteUserParams) {
  try {
    const deletedUser = await db
      .delete(user)
      .where(eq(user.id, userParam.clerkId));

    const deletedUserQuestions = await db
      .delete(question)
      .where(eq(question.authorId, userParam.clerkId));
  } catch (error) {
    return {
      error: "Failed to delete",
    };
  }
}
