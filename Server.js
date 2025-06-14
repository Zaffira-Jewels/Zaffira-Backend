// // server.js - Node.js Express Backend
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Email transporter configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or your email service
//   auth: {
//     user: process.env.EMAIL_USER, // your email
//     pass: process.env.EMAIL_PASS  // your app password
//   }
// });

// // Alternative configuration for other email services
// // const transporter = nodemailer.createTransport({
// //   host: 'smtp.your-email-provider.com',
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });

// // Function to generate email HTML template
// const generateEmailTemplate = (appointmentData) => {
//   const { name, email, phone, notes, date, time, cartItems } = appointmentData;
  
//   const cartItemsHTML = cartItems.map(item => `
//     <tr>
//       <td style="padding: 10px; border-bottom: 1px solid #eee;">
//         <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
//       </td>
//       <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toLocaleString()}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toLocaleString()}</td>
//     </tr>
//   `).join('');

//   const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   return `
//     <html>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h1 style="color: #2c3e50; text-align: center;">New Appointment Booking</h1>
          
//           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h2 style="color: #2c3e50; margin-top: 0;">Customer Information</h2>
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Phone:</strong> ${phone}</p>
//             <p><strong>Appointment Date:</strong> ${new Date(date).toLocaleDateString()}</p>
//             <p><strong>Appointment Time:</strong> ${time}</p>
//             ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
//           </div>

//           ${cartItems.length > 0 ? `
//           <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//             <h2 style="color: #2c3e50; margin-top: 0;">Selected Items</h2>
//             <table style="width: 100%; border-collapse: collapse;">
//               <thead>
//                 <tr style="background-color: #f1f1f1;">
//                   <th style="padding: 10px; text-align: left;">Image</th>
//                   <th style="padding: 10px; text-align: left;">Product</th>
//                   <th style="padding: 10px; text-align: left;">Price</th>
//                   <th style="padding: 10px; text-align: left;">Qty</th>
//                   <th style="padding: 10px; text-align: left;">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${cartItemsHTML}
//               </tbody>
//             </table>
//             <div style="text-align: right; margin-top: 20px; font-size: 18px;">
//               <strong>Grand Total: $${total.toLocaleString()}</strong>
//             </div>
//           </div>
//           ` : '<p>No items selected for consultation.</p>'}

//           <div style="margin-top: 30px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
//             <p style="margin: 0; text-align: center; color: #2c3e50;">
//               Please contact the customer to confirm the appointment details.
//             </p>
//           </div>
//         </div>
//       </body>
//     </html>
//   `;
// };

// // API endpoint to handle appointment booking
// app.post('/api/book-appointment', async (req, res) => {
//   try {
//     const appointmentData = req.body;
    
//     // Validate required fields
//     const { name, email, phone, date, time } = appointmentData;
//     if (!name || !email || !phone || !date || !time) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }

//     // Email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.BUSINESS_EMAIL, // Your business email
//       subject: `New Appointment Booking - ${name}`,
//       html: generateEmailTemplate(appointmentData),
//       // Also send a copy to the customer
//       cc: email
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     // Optional: Send confirmation email to customer
//     const customerMailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Appointment Booking Confirmation',
//       html: `
//         <html>
//           <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//             <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//               <h1 style="color: #2c3e50;">Thank You for Your Booking!</h1>
//               <p>Dear ${name},</p>
//               <p>We have received your appointment booking for <strong>${new Date(date).toLocaleDateString()}</strong> at <strong>${time}</strong>.</p>
//               <p>We will contact you soon to confirm your appointment details.</p>
//               <p>If you have any questions, please don't hesitate to reach out.</p>
//               <br>
//               <p>Best regards,<br>Your Jewelry Team</p>
//             </div>
//           </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(customerMailOptions);

//     res.json({
//       success: true,
//       message: 'Appointment booked successfully! Confirmation emails sent.'
//     });

//   } catch (error) {
//     console.error('Error booking appointment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to book appointment. Please try again.'
//     });
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;













// server.js - Node.js Express Backend
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // You'll need to install: npm install uuid
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for appointments (replace with database in production)
let appointments = [];

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  }
});

// Function to generate email HTML template
const generateEmailTemplate = (appointmentData) => {
  const { name, email, phone, notes, date, time, cartItems } = appointmentData;
  
  const cartItemsHTML = cartItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; text-align: center;">New Appointment Booking</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Appointment Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Appointment Time:</strong> ${time}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>

          ${cartItems.length > 0 ? `
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Selected Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f1f1;">
                  <th style="padding: 10px; text-align: left;">Image</th>
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: left;">Price</th>
                  <th style="padding: 10px; text-align: left;">Qty</th>
                  <th style="padding: 10px; text-align: left;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${cartItemsHTML}
              </tbody>
            </table>
            <div style="text-align: right; margin-top: 20px; font-size: 18px;">
              <strong>Grand Total: $${total.toLocaleString()}</strong>
            </div>
          </div>
          ` : '<p>No items selected for consultation.</p>'}

          <div style="margin-top: 30px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
            <p style="margin: 0; text-align: center; color: #2c3e50;">
              Please contact the customer to confirm the appointment details.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// GET endpoint to retrieve all appointments
app.get('/api/appointments', (req, res) => {
  try {
    res.json({
      success: true,
      appointments: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// POST endpoint to update appointment status
app.put('/api/appointments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    appointments[appointmentIndex].status = status;
    
    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
});

// DELETE endpoint to delete an appointment
app.delete('/api/appointments/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    appointments.splice(appointmentIndex, 1);
    
    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment'
    });
  }
});

// API endpoint to handle appointment booking
app.post('/api/book-appointment', async (req, res) => {
  try {
    const appointmentData = req.body;
    
    // Validate required fields
    const { name, email, phone, date, time } = appointmentData;
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create appointment object with unique ID
    const appointment = {
      id: uuidv4(),
      name,
      email,
      phone,
      date,
      time,
      cartItems: appointmentData.cartItems || [],
      notes: appointmentData.notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      total: appointmentData.cartItems ? 
        appointmentData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0
    };

    // Store appointment in memory (replace with database in production)
    appointments.push(appointment);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BUSINESS_EMAIL, // Your business email
      subject: `New Appointment Booking - ${name}`,
      html: generateEmailTemplate(appointmentData),
      // Also send a copy to the customer
      cc: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Booking Confirmation',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2c3e50;">Thank You for Your Booking!</h1>
              <p>Dear ${name},</p>
              <p>We have received your appointment booking for <strong>${new Date(date).toLocaleDateString()}</strong> at <strong>${time}</strong>.</p>
              <p>We will contact you soon to confirm your appointment details.</p>
              <p>If you have any questions, please don't hesitate to reach out.</p>
              <br>
              <p>Best regards,<br>Your Jewelry Team</p>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(customerMailOptions);

    res.json({
      success: true,
      message: 'Appointment booked successfully! Confirmation emails sent.',
      appointment: appointment
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
