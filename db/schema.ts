import { relations, sql } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  bio: varchar("bio", { length: 255 }),
  avatar: varchar("avatar", { length: 255 })
    .default(
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    )
    .notNull(),
  location: varchar("location", { length: 255 }),
  portfolio: varchar("portfolio", { length: 255 }),
  reputation: int("reputation").default(0).notNull(),
  created_at: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const question = mysqlTable("question", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  authorId: varchar("authorId", { length: 255 }).notNull(),
  title: varchar("title", { length: 130 }).notNull(),
  explanation: varchar("explanation", { length: 130 }).notNull(),
  created_at: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  upVotes: int("upVotes").default(0).notNull(),
  downVotes: int("downVotes").default(0).notNull(),
  views: int("views").default(0).notNull(),
  answers: int("answers").default(0).notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  questions: many(question, { relationName: "author" }),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
  author: one(user, {
    fields: [question.authorId],
    references: [user.id],
    relationName: "author",
  }),
  questionToTags: many(questionToTags, { relationName: "question" }),
}));

export const tags = mysqlTable("tags", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  followers: int("followers").default(0).notNull(),
  created_at: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const questionToTags = mysqlTable("questionToTags", {
  questionId: varchar("questionId", { length: 255 }).notNull(),
  tagId: varchar("tagId", { length: 255 }).notNull(),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  questionsToTags: many(questionToTags, { relationName: "tag" }),
}));

export const questionToTagsRelations = relations(questionToTags, ({ one }) => ({
  question: one(question, {
    fields: [questionToTags.questionId],
    references: [question.id],
    relationName: "question",
  }),
  tag: one(tags, {
    fields: [questionToTags.tagId],
    references: [tags.id],
    relationName: "tag",
  }),
}));
