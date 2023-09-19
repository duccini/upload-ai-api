import { fastifyMultipart } from "@fastify/Multipart";
import { FastifyInstance } from "fastify";

import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

// stream ler/escrever dados aos poucos
// pipeline aguardar todo o upload finalizar
// promisify transforma uma função (pipeline) com uma API mais antida(que trab somente com callback),
// para usar async/await
const pump = promisify(pipeline);

/**
 * As APP em Node suportam nativamente chamadas a APIs via JSON
 * Qndo queremos enviar um arquivo, geralmente os frameworks tem um pacote a parte
 * Express -> multer
 * Fastify -> Fastify Multipart
 */

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    },
  });

  // reply = response ?!, retornar algum dado
  // request pegar dados da requisição, tais como body, parametros da rota, parametros do get

  app.post("/videos", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "Missing file input" });
    }

    // path vem dentro do node
    // no frontend o video sera convertido para audio
    const extension = path.extname(data.filename);

    if (extension !== ".mp3") {
      return reply
        .status(400)
        .send({ error: "Invalid input type, please upload a MP3" });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    // __dirname retorna a pasta onde o arquivo esta
    const uploadDestination = path.resolve(
      __dirname,
      "../../tmp",
      fileUploadName
    );

    // pump(recebe o arq, escreve o arq)
    await pump(data.file, fs.createWriteStream(uploadDestination));

    // Salvar no BD
    const video = await prisma.video.create({
      data: {
        name: data.filename, // nome original do arquivo ??
        path: uploadDestination,
      },
    });

    return {
      video,
    };
  });
}
