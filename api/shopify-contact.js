import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const data = req.body;

  // Load the HTML template
  const templatePath = path.resolve('templates/email-template.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders with form data
  htmlTemplate = htmlTemplate
    .replace('{{ name }}', data["contact[Name]"] || '')
    .replace('{{ email }}', data["contact[email]"] || '')
    .replace('{{ phone }}', data["contact[Phone number]"] || '')
    .replace('{{ comment }}', data["contact[Comment]"] || '')
    .replace('{{ current_page }}', data.current_page || '');

  // Setup Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Send email to customer
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: data["contact[email]"],
    subject: 'Thanks for contacting The Rural Art!',
    html: htmlTemplate, // ✅ HTML template here
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent with template' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
