import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createReadStream } from "node:fs";
import { openai } from "../lib/openai";

// a transcrição será feita de um video já carregado previamente
export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (req, res) => {
    // Definindo o formato de params e o que esperamos que tenha dentro dele
    const paramsSchema = z.object({
      // string no formato uuid, que é salvo no BD
      videoId: z.string().uuid({ message: "Invalid UUID" }),
    });

    // o parse valida, ou nao, se params está seguindo o formato de paramsSchema
    // se seguir, retorna o objeto
    const { videoId } = paramsSchema.parse(req.params);

    // alem do video para transcrição, inserimos o prompt no corpo da requisição
    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(req.body);
  });
}
