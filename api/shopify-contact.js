import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const contactData = req.body;
  const logLine = `[${new Date().toISOString()}] ${JSON.stringify(contactData)}\n`;

  // Ensure path points to project root
  const logPath = path.resolve('log.txt');
  fs.appendFileSync(logPath, logLine, 'utf8');

  return res.status(200).json({ message: 'Logged locally to log.txt' });
}
