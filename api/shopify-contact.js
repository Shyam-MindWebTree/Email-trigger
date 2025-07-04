import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS headers to allow requests from anywhere (or specify Shopify domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // CORS preflight OK
  }

  // Reject other non-POST methods
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const contactData = req.body;

    // Log data to file (only works locally)
    const logLine = `[${new Date().toISOString()}] ${JSON.stringify(contactData)}\n`;
    const logPath = path.resolve('log.txt');

    fs.appendFileSync(logPath, logLine, 'utf8');

    return res.status(200).json({ message: 'Logged locally to log.txt' });
  } catch (error) {
    console.error('Logging failed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
