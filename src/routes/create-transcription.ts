import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

// videoId pode existir ou nao
export async function getAllPromptsRoute(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (req, res) => {
    // Definindo o formato de params e o que esperamos que tenha dentro dele
    const paramsSchema = z.object({
      // string no formato uuid, que é salvo no BD
      videoId: z.string().uuid({ message: "Invalid UUID" }),
    });

    // o parse valida, ou nao, se params está seguindo o formato de paramsSchema
    // se seguir, retorna o objeto
    const { videoId } = paramsSchema.parse(req.params);
  });
}
