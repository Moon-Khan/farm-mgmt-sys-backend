import nodemailer from "nodemailer";

export interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class NotificationService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = port === 465; // true for 465, false for other ports

    if (!host || !user || !pass) {
      throw new Error("SMTP credentials are not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    return this.transporter;
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER || "no-reply@example.com";
    const transporter = this.getTransporter();

    const info = await transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    console.log("[NotificationService] Email sent:", info.messageId);
  }

  async sendReminderEmail(reminder: any): Promise<void> {
    const to = process.env.NOTIFY_EMAIL || "dev@example.com";
    const subject = `Reminder: ${reminder.type} on Plot #${reminder.plot_id}`;
    const when = new Date(reminder.due_date).toLocaleString();
    const text = `A new reminder has been generated.\n\nType: ${reminder.type}\nPlot: ${reminder.plot_id}\nCrop: ${reminder.crop_id}\nDue: ${when}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h3>Farm Task Reminder</h3>
        <p><strong>Type:</strong> ${reminder.type}</p>
        <p><strong>Plot:</strong> ${reminder.plot_id}</p>
        <p><strong>Crop:</strong> ${reminder.crop_id}</p>
        <p><strong>Due:</strong> ${when}</p>
      </div>
    `;
    await this.sendEmail({ to, subject, text, html });
  }
}

export default new NotificationService();
