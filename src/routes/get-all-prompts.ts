import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

// A função do Fastify precisa receber a Aplicação como parâmetro
// Colocando o mouse em cima do app, vemos qual o tipo dela
// A função precisa ser obrigatoriamente assíncrona
export async function getAllPromptsRoute(app: FastifyInstance) {
  app.get("/prompts", async () => {
    const prompts = await prisma.prompt.findMany();
    return prompts;
  });
}
