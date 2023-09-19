import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";

const app = fastify();

// cadastrar a rota no app
// todos os modulos cadastrados pelo registor precisam ser async
app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);

app
  .listen({
    port: 3330,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
