import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  // Check if SMTP credentials are configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  SMTP credentials not configured. Emails will be logged to console only.");
    // Return a test transporter that logs to console
    return nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
  }

  // Determine if we should use secure connection (SSL/TLS)
  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = port === 465; // Use secure for port 465, otherwise use STARTTLS

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Additional options for Gmail
    tls: {
      // Do not fail on invalid certs (for development)
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const transporter = createTransporter();
    
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-order/${order.confirmationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ShopVerse" <noreply@shopverse.com>',
      to: userEmail,
      subject: "Confirm Your Order - ShopVerse",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-size: 1.2em; font-weight: bold; color: #667eea; margin-top: 15px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ ShopVerse</h1>
              <h2>Confirm Your Order</h2>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for your order! Please confirm your order to proceed with processing.</p>
              
              <div class="order-details">
                <h3>Order #${order._id.toString().slice(-8).toUpperCase()}</h3>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                
                <h4>Items:</h4>
                ${order.orderItems.map(item => `
                  <div class="item">
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}
                  </div>
                `).join('')}
                
                <div class="total">
                  <p>Subtotal: $${order.itemsPrice.toFixed(2)}</p>
                  <p>Tax: $${order.taxPrice.toFixed(2)}</p>
                  <p>Shipping: $${order.shippingPrice.toFixed(2)}</p>
                  <p style="font-size: 1.3em; color: #667eea;">Total: $${order.totalPrice.toFixed(2)}</p>
                </div>
                
                <h4>Shipping Address:</h4>
                <p>
                  ${order.shippingAddress.address}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                  ${order.shippingAddress.country}
                </p>
                
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              </div>
              
              <center>
                <a href="${confirmationUrl}" class="button">Confirm Order</a>
              </center>
              
              <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmationUrl}">${confirmationUrl}</a>
              </p>
              
              <p style="margin-top: 20px; color: #999; font-size: 0.9em;">
                <strong>Note:</strong> This order will be automatically cancelled if not confirmed within 24 hours.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2024 ShopVerse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log email details
    console.log("📧 Order confirmation email sent!");
    console.log("   To:", userEmail);
    console.log("   Order ID:", order._id.toString().slice(-8).toUpperCase());
    console.log("   Confirmation URL:", confirmationUrl);
    
    // For ethereal email, show preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("   Preview URL:", previewUrl);
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send order confirmed notification
export const sendOrderConfirmedNotification = async (order, userEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ShopVerse" <noreply@shopverse.com>',
      to: userEmail,
      subject: "Order Confirmed - ShopVerse",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ ShopVerse</h1>
              <h2>Order Confirmed!</h2>
            </div>
            <div class="content">
              <div class="success">
                <h3>✓ Your order has been confirmed</h3>
              </div>
              
              <p>Hi there,</p>
              <p>Great news! Your order #${order._id.toString().slice(-8).toUpperCase()} has been confirmed and is now being processed.</p>
              
              <p>We'll send you another email when your order ships.</p>
              
              <p>You can track your order status anytime by visiting your account.</p>
              
              <p>Thank you for shopping with ShopVerse!</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2024 ShopVerse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("📧 Order confirmed notification sent!");
    console.log("   To:", userEmail);
    console.log("   Order ID:", order._id.toString().slice(-8).toUpperCase());
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("   Preview URL:", previewUrl);
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send order shipped notification
export const sendOrderShippedNotification = async (order, userEmail) => {
  try {
    const transporter = createTransporter();
    
    const trackingUrl = order.trackingNumber 
      ? `${process.env.FRONTEND_URL}/tracking/${order._id}`
      : null;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ShopVerse" <noreply@shopverse.com>',
      to: userEmail,
      subject: "Your Order Has Shipped! - ShopVerse",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .tracking-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 ShopVerse</h1>
              <h2>Your Order is On Its Way!</h2>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Great news! Your order #${order._id.toString().slice(-8).toUpperCase()} has been shipped and is on its way to you.</p>
              
              ${order.trackingNumber ? `
                <div class="tracking-box">
                  <h3 style="margin-top: 0;">📦 Tracking Information</h3>
                  <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
                  <p style="font-size: 0.9em; color: #666;">You can use this number to track your package.</p>
                </div>
              ` : ''}
              
              ${trackingUrl ? `
                <center>
                  <a href="${trackingUrl}" class="button">Track Your Order</a>
                </center>
              ` : ''}
              
              <p>Your order should arrive within 3-5 business days.</p>
              
              <p>Thank you for shopping with ShopVerse!</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2024 ShopVerse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("📧 Order shipped notification sent!");
    console.log("   To:", userEmail);
    console.log("   Order ID:", order._id.toString().slice(-8).toUpperCase());
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("   Preview URL:", previewUrl);
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send order delivered notification with review request
export const sendOrderDeliveredNotification = async (order, userEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ShopVerse" <noreply@shopverse.com>',
      to: userEmail,
      subject: "Your Order Has Been Delivered! - ShopVerse",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
            .product-item { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ShopVerse</h1>
              <h2>Your Order Has Been Delivered!</h2>
            </div>
            <div class="content">
              <div class="success">
                <h3>✓ Delivery Confirmed</h3>
              </div>
              
              <p>Hi there,</p>
              <p>Your order #${order._id.toString().slice(-8).toUpperCase()} has been successfully delivered!</p>
              
              <p>We hope you love your purchase! 💙</p>
              
              <h3>📝 Share Your Experience</h3>
              <p>Your feedback helps other customers make informed decisions. Would you like to review your purchase?</p>
              
              <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin-top: 0;">Products in this order:</h4>
                ${order.orderItems.map(item => `
                  <div class="product-item">
                    <strong>${item.name}</strong><br>
                    <a href="${process.env.FRONTEND_URL}/product/${item.product}" class="button" style="font-size: 0.9em; padding: 10px 20px;">Write a Review</a>
                  </div>
                `).join('')}
              </div>
              
              <p style="margin-top: 30px;">Thank you for shopping with ShopVerse!</p>
              
              <p style="font-size: 0.9em; color: #666;">
                If you have any issues with your order, please contact our support team.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2024 ShopVerse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("📧 Order delivered notification sent!");
    console.log("   To:", userEmail);
    console.log("   Order ID:", order._id.toString().slice(-8).toUpperCase());
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("   Preview URL:", previewUrl);
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
