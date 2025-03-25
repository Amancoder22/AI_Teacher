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

  // Cross-platform server configuration
  const configureServer = () => {
    // Environment detection
    const isReplit = process.env.REPL_ID !== undefined;
    const nodeVersion = process.version;
    const nodeVersionNum = parseFloat(process.version.replace('v', ''));
    
    // Determine appropriate port (Replit uses 5000, local typically 3000)
    const defaultPort = isReplit ? 5000 : 3000;
    const port = process.env.PORT ? parseInt(process.env.PORT) : defaultPort;
    
    log(`Environment: ${isReplit ? 'Replit' : 'Local'}, Node.js ${nodeVersion}`);
    
    // Server configuration options
    const serverOptions = (() => {
      // Basic configuration that works everywhere
      const baseConfig = {
        port,
        host: "0.0.0.0"
      };
      
      // Only add reusePort on Replit or older Node versions
      // This option causes ENOTSUP errors on newer Node.js versions (v22+) on some OSes
      if (isReplit || nodeVersionNum < 22) {
        return {
          ...baseConfig,
          reusePort: true
        };
      }
      
      return baseConfig;
    })();
    
    // Function to start server with appropriate error handling
    const startWithOptions = (options: any, callback?: Function) => {
      try {
        if ('reusePort' in options) {
          // Advanced options method
          server.listen(options, () => {
            log(`Server started on port ${options.port} with advanced options`);
            callback?.();
          });
        } else {
          // Standard method
          server.listen(options.port, options.host, () => {
            log(`Server started on port ${options.port} with standard options`);
            callback?.();
          });
        }
      } catch (err) {
        log(`Error starting server: ${err}`);
        fallbackToStandard(options.port);
      }
    };
    
    // Fallback function if advanced options fail
    const fallbackToStandard = (initialPort: number) => {
      log(`Falling back to standard configuration`);
      server.listen(initialPort, "0.0.0.0", () => {
        log(`Server started on port ${initialPort} with fallback configuration`);
      });
    };
    
    // Try alternative port if the initial one fails
    const tryAlternativePort = (initialPort: number) => {
      const altPort = initialPort + 1;
      log(`Trying alternative port ${altPort}`);
      
      // Close the server first if it's listening
      if (server.listening) {
        server.close();
      }
      
      // Try with standard options on new port
      server.listen(altPort, "0.0.0.0", () => {
        log(`Server started on alternative port ${altPort}`);
      });
    };
    
    // Add comprehensive error handler
    server.on('error', (err: Error & { code?: string, syscall?: string }) => {
      log(`Server error: ${err.message} (Code: ${err.code || 'unknown'})`);
      
      // Handle specific error types
      if (err.code === 'ENOTSUP' && err.syscall === 'listen') {
        // Socket operation not supported - typically from reusePort on certain platforms
        log(`Socket option not supported on this platform`);
        fallbackToStandard(port);
      } else if (err.code === 'EADDRINUSE') {
        // Address already in use - try a different port
        log(`Port ${port} already in use`);
        tryAlternativePort(port);
      } else if (err.code === 'EACCES') {
        // Permission denied - typically when trying to use privileged ports
        log(`Permission denied for port ${port}, try running with elevated privileges or use a port > 1024`);
        tryAlternativePort(Math.max(port, 1024));
      }
    });
    
    // Start the server with the determined configuration
    startWithOptions(serverOptions);
  };
  
  // Initialize server
  configureServer();
})();
