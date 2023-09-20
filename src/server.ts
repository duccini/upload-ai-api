import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAiCompleteRoute } from "./routes/generate-ai-completion";

const app = fastify();

// Set Cors
// qualquer url pode acessar o backend
// ideal: em produção colocar o end de onde esta hospedado o backend
app.register(fastifyCors, {
  origin: "*",
});

// cadastrar a rota no app
// todos os modulos cadastrados pelo registor precisam ser async
app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAiCompleteRoute);

app
  .listen({
    port: 3330,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
