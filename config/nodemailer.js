const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready');
    }
});

// Send emails
const sendContactEmail = async (name, email, budget, message) => {
    try {
        console.log('📧 Attempting to send emails...');
        console.log('📧 From:', process.env.EMAIL_USER);
        console.log('📧 To:', 'umar70403@gmail.com');

        // Email to admin (you)
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: 'umar70403@gmail.com',
            subject: `📬 New Contact Form Message from ${name}`,
            text: `
📬 New Contact Form Submission

📌 Name: ${name}
📧 Email: ${email}
💰 Budget: ${budget || 'Not specified'}

📝 Message:
${message}

Sent from your portfolio website
            `,
            html: `
                <div style="font-family: Arial; max-width: 600px; padding: 20px; background: #f9f9f9; border-radius: 10px;">
                    <h2 style="color: #4fc3f7;">📬 New Contact Form Submission</h2>
                    <hr>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #4fc3f7;">${message}</p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">Sent from your portfolio website</p>
                </div>
            `
        };

        // Auto-reply to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Rana Umar!',
            text: `
👋 Thank You for Reaching Out!

Hi ${name},

I've received your message and will get back to you within 24 hours.

Here's a copy of your message:
${message}

Best regards,
Rana Umar
Web Developer & Designer
            `,
            html: `
                <div style="font-family: Arial; max-width: 600px; padding: 20px; background: #f9f9f9; border-radius: 10px;">
                    <h2 style="color: #4fc3f7;">👋 Thank You for Reaching Out!</h2>
                    <hr>
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>I've received your message and will get back to you within <strong>24 hours</strong>.</p>
                    <hr>
                    <p style="color: #888; font-size: 14px;">Here's a copy of your message:</p>
                    <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #4fc3f7;">${message}</p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">Best regards,<br><strong>Rana Umar</strong><br>Web Developer & Designer</p>
                </div>
            `
        };

        // Send admin email first
        console.log('📧 Sending admin email...');
        await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin email sent to umar70403@gmail.com');

        // Then send user auto-reply
        console.log('📧 Sending auto-reply...');
        await transporter.sendMail(userMailOptions);
        console.log('✅ Auto-reply sent to', email);

        return { success: true };

    } catch (error) {
        console.error('❌ Email error:', error);
        console.error('❌ Error details:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendContactEmail };