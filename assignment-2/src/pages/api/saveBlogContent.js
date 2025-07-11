import clientPromise from '@/lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { url, content } = req.body
    const client = await clientPromise
    const db = client.db('blogDB')
    const collection = db.collection('contents')

    await collection.insertOne({ url, content, createdAt: new Date() })

    res.status(200).json({ message: 'Content saved to MongoDB!' })
  } catch (error) {
    console.error('Mongo Error:', error)
    res.status(500).json({ error: 'MongoDB Insert Failed' })
  }
}
