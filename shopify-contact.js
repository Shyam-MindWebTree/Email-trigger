export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const contactData = req.body;

  console.log('Received contact data:', contactData);

  // Add logic: store in DB, send email, forward to webhook, etc.

  return res.status(200).json({ message: 'Data received successfully' });
}
