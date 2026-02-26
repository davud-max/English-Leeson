-- CreateTable
CREATE TABLE "LessonHistory" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "slides" JSONB,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "emoji" VARCHAR(10) NOT NULL DEFAULT '📖',
    "color" VARCHAR(50) NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
    "available" BOOLEAN NOT NULL DEFAULT false,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,

    CONSTRAINT "LessonHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LessonHistory" ADD CONSTRAINT "LessonHistory_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHistory" ADD CONSTRAINT "LessonHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "LessonHistory_lessonId_changedAt_idx" ON "LessonHistory"("lessonId", "changedAt");