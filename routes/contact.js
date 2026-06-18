const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../config/nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, budget, message } = req.body;

        console.log('📨 Received form submission:', { name, email, budget, message });

        // Validate
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }

        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        // Save to MongoDB
        const newContact = new Contact({
            name,
            email,
            budget: budget || 'Not specified',
            message,
            source: 'Portfolio Website'
        });

        await newContact.save();
        console.log('✅ Message saved to MongoDB');

        // Send emails (wrap in try-catch to prevent crashing)
        try {
            await sendContactEmail(name, email, budget, message);
            console.log('✅ Emails sent successfully');
        } catch (emailError) {
            console.error('❌ Email error (but data was saved):', emailError.message);
            // Still return success since data is saved
        }

        res.json({
            success: true,
            message: 'Message sent successfully! Check your email for confirmation.',
            data: newContact
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.',
            error: error.message
        });
    }
});

// GET /api/contact
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

module.exports = router;