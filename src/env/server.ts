import { z } from "zod";

const serverSchema = z.object({
  APIFY_TOKEN: z.string().min(1, "APIFY_TOKEN is required"),
});

const serverEnv = serverSchema.parse(process.env);
export default serverEnv;
