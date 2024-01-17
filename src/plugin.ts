import path from "node:path";
import { type IndexHtmlTransformContext, type Plugin } from "vite";
import { configureTwig, parseHTML, retrieveConfigFromFile } from "./tasks";

export async function viteTwigPlugin(): Promise<Plugin> {
  const config = await retrieveConfigFromFile();
  configureTwig(config);
  return {
    name: "vite-plugin-twig",

    transformIndexHtml: {
      order: "pre",
      handler: async (html: string, ctx: IndexHtmlTransformContext) => {
        return await parseHTML(html, ctx, config);
      },
    },
    handleHotUpdate({ file, server }) {
      if (path.extname(file) === ".twig") {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
