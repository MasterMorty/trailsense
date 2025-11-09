import {workWorkWork} from "#shared/import/worker";
import getDb from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const db = getDb(event)

  await workWorkWork(db)
})
