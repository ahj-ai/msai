import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  // Log the raw request
  const body = await req.text();
  const headerPayload = headers();
  const headerEntries = Array.from(headerPayload.entries());

  // Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Write log to file
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFile = path.join(logsDir, `clerk-webhook-${timestamp}.json`);
  
  fs.writeFileSync(logFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(headerEntries),
    body
  }, null, 2));

  console.log(`Clerk webhook received at ${new Date().toISOString()}`);
  console.log(`Headers: ${JSON.stringify(headerEntries)}`);
  console.log(`Body: ${body}`);

  return new Response('Debug webhook received', { status: 200 });
} 