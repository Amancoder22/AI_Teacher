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

  // Determine the port to use
  // Default to 5000 for Replit, but allow overriding with PORT env variable
  // Your local PC appears to be using port 3000
  const defaultPort = process.env.REPL_ID ? 5000 : 3000;
  const port = process.env.PORT ? parseInt(process.env.PORT) : defaultPort;
  
  // Handle server start with proper error management
  const startServer = () => {
    // Check for Node.js version to determine if we should use reusePort
    const nodeVersion = process.version;
    const isReplit = process.env.REPL_ID !== undefined;
    
    // Skip reusePort on Node.js v22+ for local environments
    if (isReplit) {
      log(`Running on Replit with Node.js ${nodeVersion}`);
      // On Replit, use reusePort
      server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`Server started on port ${port} with reusePort enabled`);
      });
    } else {
      log(`Running locally with Node.js ${nodeVersion}, using standard configuration`);
      // For local environments, use standard configuration
      server.listen(port, "0.0.0.0", () => {
        log(`Server started on port ${port} with standard configuration`);
      });
    }

    // Add error handler for both cases
    server.on('error', (err: Error & { code?: string }) => {
      log(`Server error: ${err.message}`);
      
      // If we get an ENOTSUP or EADDRINUSE error, try with a different port
      if (err.code === 'ENOTSUP' || err.code === 'EADDRINUSE') {
        const fallbackPort = port + 1;
        log(`Attempting to use fallback port ${fallbackPort}`);
        
        server.close();
        server.listen(fallbackPort, "0.0.0.0", () => {
          log(`Server started on fallback port ${fallbackPort}`);
        });
      }
    });
  };
  
  startServer();
})();
