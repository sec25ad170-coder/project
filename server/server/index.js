const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const registrationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	rollNo: { type: String, required: true },
	dob: { type: String, required: true },
	bloodGroup: { type: String, required: true },
	department: { type: String, required: true },
	gender: { type: String, required: true },
	phone: { type: String, required: true },
	year: { type: String, required: true },
	section: { type: String, required: true },
	arrears: { type: Number, required: true },
	companies: { type: [String], required: true },
}, { timestamps: true })

const Registration = mongoose.model('Registration', registrationSchema)

app.get('/', (request, response) => response.json({ status: 'ok' }))

app.get('/api/registrations', async (request, response) => {
	try {
		const registrations = await Registration.find().sort({ createdAt: -1 })
		response.json(registrations)
	} catch (error) {
		response.status(500).json({ message: 'Unable to load registrations.' })
	}
})

app.post('/api/registrations', async (request, response) => {
	try {
		const registration = await Registration.create(request.body)
		response.status(201).json(registration)
	} catch (error) {
		response.status(400).json({ message: 'Unable to save registration.' })
	}
})

async function startServer() {
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI is not configured.')
	}

	await mongoose.connect(process.env.MONGO_URI)
	app.listen(port, () => console.log(`Server running on port ${port}`))
}

startServer().catch((error) => {
	console.error('Server startup failed:', error.message)
	process.exit(1)
})
