"use server";

import { db } from "@/db/db";
import { questionsSchema } from "../validations/question";
import { question, questionToTags, tags } from "@/db/schema";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { GetQuestionsParams } from "./shared.types";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    const { userId } = auth();
    const questions = await db.query.question.findMany({
      where: (question, { eq }) => eq(question.authorId, userId),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        questionToTags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      questions,
    };
  } catch (error) {
    return {
      error: "Fuck you",
    };
  }
}

export async function createQuestion(
  formData: z.infer<typeof questionsSchema>
) {
  try {
    const content = {
      title: formData.title,
      explanation: formData.explanation,
      tags: formData.tags,
    };

    const { userId } = auth();

    if (!userId) {
      return {
        error: "Failed",
      };
    }

    const result = questionsSchema.safeParse(content);

    if (!result.success) {
      return {
        error: "Failed",
      };
    }

    const questionId = nanoid();
    const tagIds: string[] = [];

    for (const tag of formData.tags) {
      const existingTag = await db
        .select()
        .from(tags)
        .where(eq(tags.name, tag));

      if (!existingTag || existingTag.length === 0) {
        const newTagId = nanoid();
        await db.insert(tags).values({
          id: newTagId,
          name: tag,
          description: "No description",
        });
        tagIds.push(newTagId);
      } else {
        tagIds.push(existingTag[0].id); // Store existing tag ID
      }
    }
    await db.insert(question).values({
      id: questionId,
      authorId: userId,
      title: formData.title,
      explanation: formData.explanation,
    });

    for (const tagId of tagIds) {
      await db.insert(questionToTags).values({
        questionId,
        tagId,
      });
    }

    redirect("/");
  } catch (error) {
    return {
      error: "Failed",
    };
  }
}
