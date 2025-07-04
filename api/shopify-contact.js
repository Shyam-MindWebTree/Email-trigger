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

  const basePath = path.join(process.cwd(), 'api');
  const templatecontact = path.join(basePath, 'contact-template.html');
  const templcustomization = path.join(basePath, 'customization-template1.html');
  const templatetrade = path.join(basePath, 'trade-template2.html');

  let htmlTemplatecontact = fs.readFileSync(templatecontact, 'utf8');
  let htmlTemplcustomization = fs.readFileSync(templcustomization, 'utf8');
  let htmlTtemplatetrade = fs.readFileSync(templatetrade, 'utf8');

  let selectedTemplate = htmlTemplatecontact;
  let subject = 'Thank You for Contacting The Rural Art'; 
  if (data.current_page === 'customization-services') {
    subject = "Thank You for Your Customization Request – We're Excited to Create Something Special"
    selectedTemplate = htmlTemplcustomization;
  } else if (data.current_page === 'trade-design-sign-up') {
    subject = "Thank You for Connecting with The Rural Art Trade Program"
    selectedTemplate = htmlTtemplatetrade;
  }

  selectedTemplate = selectedTemplate
    .replace('{{ name }}', data["contact[Name]"] || '')
    // .replace('{{ email }}', data["contact[email]"] || '')
    // .replace('{{ phone }}', data["contact[Phone number]"] || '')
    // .replace('{{ comment }}', data["contact[Comment]"] || '')
    // .replace('{{ current_page }}', data.current_page || '');


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: data["contact[email]"],
    subject: subject,
    html: selectedTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent with template' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
