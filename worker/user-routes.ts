import { Hono } from "hono";
import type { Env } from './core-utils';
import { ClientEntity, LeadEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Client, Lead, PipelineStage, UploadedFile } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CLIENTS API
  // List all clients with pagination
  app.get('/api/clients', async (c) => {
    await ClientEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const limit = lq ? Math.max(1, Math.min(100, Number(lq) | 0)) : 20;
    const page = await ClientEntity.list(c.env, cq ?? null, limit);
    return ok(c, page);
  });
  // Get a single client by ID
  app.get('/api/clients/:id', async (c) => {
    const id = c.req.param('id');
    const clientEntity = new ClientEntity(c.env, id);
    if (!await clientEntity.exists()) {
      return notFound(c, 'Client not found');
    }
    const client = await clientEntity.getState();
    return ok(c, client);
  });
  // Create a new client
  app.post('/api/clients', async (c) => {
    const body = await c.req.json<Partial<Client>>();
    if (!body.company || !body.email) {
      return bad(c, 'Company and email are required');
    }
    const newClient: Client = {
      ...ClientEntity.initialState,
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const created = await ClientEntity.create(c.env, newClient);
    return ok(c, created);
  });
  // Update a client
  app.put('/api/clients/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Client>>();
    const clientEntity = new ClientEntity(c.env, id);
    if (!await clientEntity.exists()) {
      return notFound(c, 'Client not found');
    }
    await clientEntity.patch(body);
    const updatedClient = await clientEntity.getState();
    return ok(c, updatedClient);
  });
  // Delete a client
  app.delete('/api/clients/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ClientEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Client not found or already deleted');
    }
    return ok(c, { id, deleted: true });
  });
  // Add a file to a client
  app.post('/api/clients/:id/files', async (c) => {
    const id = c.req.param('id');
    const fileMetadata = await c.req.json<Omit<UploadedFile, 'id' | 'uploadDate'>>();
    const clientEntity = new ClientEntity(c.env, id);
    if (!await clientEntity.exists()) {
      return notFound(c, 'Client not found');
    }
    const newFile: UploadedFile = {
      ...fileMetadata,
      id: crypto.randomUUID(),
      uploadDate: new Date().toISOString(),
    };
    await clientEntity.mutate(client => ({
      ...client,
      uploadedFiles: [...client.uploadedFiles, newFile],
    }));
    const updatedClient = await clientEntity.getState();
    return ok(c, updatedClient);
  });

  // Delete a file from a client
  app.delete('/api/clients/:id/files/:fileId', async (c) => {
    const id = c.req.param('id');
    const fileId = c.req.param('fileId');
    const clientEntity = new ClientEntity(c.env, id);
    if (!await clientEntity.exists()) {
      return notFound(c, 'Client not found');
    }
    await clientEntity.mutate(client => ({
      ...client,
      uploadedFiles: client.uploadedFiles.filter(f => f.id !== fileId),
    }));
    const updatedClient = await clientEntity.getState();
    return ok(c, updatedClient);
  });
  // LEADS API
  // List all leads
  app.get('/api/leads', async (c) => {
    await LeadEntity.ensureSeed(c.env);
    // For this Kanban, we fetch all leads. Pagination could be added for a table view.
    const page = await LeadEntity.list(c.env, null, 100); // Limit to 100 for now
    return ok(c, page.items);
  });
  // Update a lead's stage
  app.put('/api/leads/:id/stage', async (c) => {
    const id = c.req.param('id');
    const { stage } = await c.req.json<{ stage: PipelineStage }>();
    if (!stage) {
      return bad(c, 'Stage is required');
    }
    const leadEntity = new LeadEntity(c.env, id);
    if (!await leadEntity.exists()) {
      return notFound(c, 'Lead not found');
    }
    await leadEntity.patch({ stage });
    const updatedLead = await leadEntity.getState();
    return ok(c, updatedLead);
  });
}