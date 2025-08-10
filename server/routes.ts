import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initiateGoogleAuth, handleGoogleCallback } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Google OAuth routes
  app.get("/auth/google", async (req, res) => {
    try {
      const authUrl = await initiateGoogleAuth();
      res.redirect(authUrl);
    } catch (error) {
      console.error('Google auth initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate Google authentication' });
    }
  });

  app.get("/auth/google/callback", async (req, res) => {
    try {
      const { code, error: authError } = req.query;

      if (authError) {
        // User denied access or other OAuth error
        res.redirect(`/?error=${encodeURIComponent(authError as string)}`);
        return;
      }

      if (!code) {
        res.redirect('/?error=no_code');
        return;
      }

      const { data } = await handleGoogleCallback(code as string);
      
      // Set session cookie or redirect with tokens
      // For now, just redirect to home with success
      res.redirect('/?auth=success');
      
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('/?error=auth_failed');
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
