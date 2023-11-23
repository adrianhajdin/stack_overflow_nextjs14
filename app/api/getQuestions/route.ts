import { db } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Question = {
  id: string;
  title: string;
  explanation: string;
  authorId: string;
  created_at: Date;
  upVotes: number;
  downVotes: number;
  views: number;
  answers: number;
  questionToTags: {
    questionId: string;
    tagId: string;
  };
};

export async function GET() {
  try {
   

    console.log(questions);

    if (!questions) {
      return new NextResponse("No questions found", { status: 404 });
    }

    return NextResponse.json(questions);
  } catch (error) {}
}
