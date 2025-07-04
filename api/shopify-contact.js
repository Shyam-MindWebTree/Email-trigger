import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const contactData = req.body;
  console.log('Received contact data:', contactData);

  // Prepare log line
  const logLine = `[${new Date().toISOString()}] ${JSON.stringify(contactData)}\n`;

  // Write to logs/contact-log.txt
  const logPath = path.resolve('./logs/contact-log.txt');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, logLine, 'utf8');

  return res.status(200).json({ message: 'Data received and logged' });
}
