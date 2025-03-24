import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  // Use an async wrapper to handle potential errors with server.listen
  const startServer = async () => {
    try {
      // First attempt with reusePort option (works on Replit)
      server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`serving on port ${port} with reusePort enabled`);
      });
      
      // Add error handler
      server.on('error', (err) => {
        if (err.code === 'ENOTSUP' || err.code === 'EADDRINUSE') {
          log(`Error with reusePort: ${err.message}, trying alternative configuration`);
          // Try without reusePort if it fails
          server.close();
          server.listen(port, "0.0.0.0", () => {
            log(`serving on port ${port} with standard configuration`);
          });
        } else {
          log(`Server error: ${err.message}`);
        }
      });
    } catch (err) {
      // Fallback for environments that don't support reusePort
      log(`Error starting server: ${err}`);
      log("Falling back to standard server configuration");
      server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port}`);
      });
    }
  };
  
  startServer();
})();
