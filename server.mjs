import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";

const isProduction = process.env.NODE_ENV === "production";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const requestListener = async (req, res) => {
  // Serve static files from the "dist" folder in production
  if (isProduction) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = url.pathname;

    // Normalize root to index.html
    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    // Resolve the file path within the dist directory
    const filePath = resolve(__dirname, "dist", "." + pathname);

    try {
      const data = await readFile(filePath);
      // Simple mime type handling based on extension
      const ext = pathname.split(".").pop();
      const mimeTypes = {
        html: "text/html",
        js: "application/javascript",
        css: "text/css",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpeg",
        svg: "image/svg+xml",
        ico: "image/x-icon",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    } catch (err) {
      // If file not found, serve index.html for SPA routing
      if (err.code === "ENOENT") {
        try {
          const indexPath = resolve(__dirname, "dist", "index.html");
          const indexData = await readFile(indexPath);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(indexData);
        } catch (indexErr) {
          console.error("Index serve error:", indexErr);
          res.writeHead(500);
          res.end("Server error");
        }
      } else {
        console.error("File serve error:", err);
        res.writeHead(500);
        res.end("Server error");
      }
    }
  } else {
    // Development: Proxy to Vite dev server (simple example)
    res.writeHead(302);
    res.setHeader("Location", `http://localhost:5173${req.url}`);
    res.end();
  }
};

const server = createServer(requestListener);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Optional: Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
  });
});
