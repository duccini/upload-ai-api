import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createReadStream } from "node:fs";
import { openai } from "../lib/openai";

export async function generateAiCompleteRoute(app: FastifyInstance) {
  app.post("/generate", async (req, reply) => {
    const bodySchema = z.object({
      videoId: z.string().uuid({ message: "Invalid UUID" }),
      /**
       * no frontend o compo pronpt seleciona um dos templates cadastrados no BD
       * como o usuário pode editar esses templates, enviamos para esta rota o texto do template já
       * editado pelo usuário e não o ID do template
       */
      editTemplate: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    // ATENÇÃO: os dados vem do BODY e não da rota( PARAMS )
    const { videoId, editTemplate, temperature } = bodySchema.parse(req.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    // o video precisa da transcrição, se nao existir retornar erro
    if (!video.transcription) {
      return reply
        .status(400)
        .send({ error: "Video transcription was not generated yet." });
    }

    const promptMessage = editTemplate.replace(
      "{transcription}",
      video.transcription
    );

    const response = await openai.chat.completions.create({
      // Open AI tokes = tokens enviados (aprox. 1 a cada 4 palavras + tokens recebidos)
      model: "gpt-3.5-turbo-16k",
      temperature,
      messages: [
        // poderia ser varias mensagens como um historico
        { role: "user", content: promptMessage },
      ],
    });

    return response;
  });
}
