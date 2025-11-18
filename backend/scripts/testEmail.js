import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testEmail = async () => {
  console.log("🧪 Testing Email Configuration...\n");

  // Check if credentials are set
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ Error: SMTP credentials not found in .env file");
    console.log("\nPlease set the following in your .env file:");
    console.log("  SMTP_HOST=smtp.gmail.com");
    console.log("  SMTP_PORT=587");
    console.log("  SMTP_USER=your-email@gmail.com");
    console.log("  SMTP_PASS=your-app-password");
    console.log("  EMAIL_FROM=\"ShopVerse <your-email@gmail.com>\"");
    process.exit(1);
  }

  console.log("📋 Configuration:");
  console.log("  Host:", process.env.SMTP_HOST);
  console.log("  Port:", process.env.SMTP_PORT);
  console.log("  User:", process.env.SMTP_USER);
  console.log("  From:", process.env.EMAIL_FROM);
  console.log("");

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: parseInt(process.env.SMTP_PORT || "587") === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Verify connection
    console.log("🔌 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!\n");

    // Send test email
    console.log("📧 Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"ShopVerse" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: "Test Email - ShopVerse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>🛍️ ShopVerse</h1>
            <h2>Email Test Successful!</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Congratulations! Your email configuration is working correctly.</p>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>SMTP Host: ${process.env.SMTP_HOST}</li>
              <li>SMTP Port: ${process.env.SMTP_PORT}</li>
              <li>From: ${process.env.EMAIL_FROM}</li>
            </ul>
            <p>You can now send order confirmation emails!</p>
            <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
              This is a test email from ShopVerse. If you received this, your email setup is complete.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   To:", process.env.SMTP_USER);
    console.log("\n📬 Check your inbox for the test email!");
    
    // For ethereal, show preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("   Preview URL:", previewUrl);
    }

    console.log("\n✨ Email configuration is working perfectly!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    
    if (error.code === "EAUTH") {
      console.log("\n💡 Authentication failed. Please check:");
      console.log("  1. You're using an App Password (not your regular Gmail password)");
      console.log("  2. 2-Factor Authentication is enabled on your Google account");
      console.log("  3. The App Password is correct (no spaces or typos)");
      console.log("\n📖 See docs/GMAIL_SETUP.md for detailed instructions");
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNECTION") {
      console.log("\n💡 Connection failed. Please check:");
      console.log("  1. Your internet connection");
      console.log("  2. Firewall isn't blocking port", process.env.SMTP_PORT);
      console.log("  3. SMTP_HOST is correct:", process.env.SMTP_HOST);
    } else {
      console.log("\n💡 Please check your .env configuration");
      console.log("📖 See docs/GMAIL_SETUP.md for help");
    }
    
    process.exit(1);
  }
};

testEmail();
