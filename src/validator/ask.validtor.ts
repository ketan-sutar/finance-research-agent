import {z} from "zod";

export const askSchema=z.object({
  question:z.string().min(1,"Question is required").max(1000,"Question too long"),

});

export type AskInput=z.infer<typeof askSchema>