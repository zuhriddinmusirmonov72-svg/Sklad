import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// @ts-ignore
import fs from "fs";
// @ts-ignore
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Allows access from other devices on the network
    watch: {
      ignored: ['**/db.json'] // HMR (Avtomatik yangilanish) ni cheklash
    }
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    {
      name: "local-db",
      configureServer(server) {
        server.middlewares.use((req: any, res: any, next) => {
          if (req.url === "/api/db" && req.method === "GET") {
            const dbPath = path.resolve("db.json");
            if (!fs.existsSync(dbPath)) {
              fs.writeFileSync(dbPath, JSON.stringify({ products: [], orders: [] }));
            }
            const data = fs.readFileSync(dbPath, "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(data);
            return;
          }
          if (req.url === "/api/db" && (req.method === "POST" || req.method === "PUT")) {
            let body = "";
            req.on("data", (chunk: any) => { body += chunk; });
            req.on("end", () => {
              fs.writeFileSync(path.resolve("db.json"), body);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true }));
            });
            return;
          }
          next();
        });
      }
    }
  ],
});
