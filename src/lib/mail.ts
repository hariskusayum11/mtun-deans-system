import nodemailer from 'nodemailer';
import { MeetingStatus } from '@prisma/client'; // Import MeetingStatus for type safety

// Configure Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10), // Default to 587 if not set
  secure: process.env.SMTP_PORT === '465', // Use 'true' for 465, 'false' for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MeetingRequestData {
  topic: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  meetingType: "on-site" | "online";
  location?: string;
  meetingLink?: string;
  agenda?: string;
  participants: string; // Formatted names string
  universityId: string;
}

interface MeetingStatusData {
  topic: string;
  status: MeetingStatus;
  meetingId: string;
}

interface MeetingInvitationData {
  topic: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  meetingType: "on-site" | "online";
  location?: string;
  meetingLink?: string;
  agenda?: string;
  hostUniversityName: string;
}

export async function sendMeetingRequestEmail(toEmail: string, meetingData: MeetingRequestData) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const meetingDateTime = `${meetingData.date.toLocaleDateString()} at ${meetingData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  const meetingEndDateTime = meetingData.endTime ? ` - ${meetingData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` : '';
  const locationOrLink = meetingData.meetingType === 'on-site'
    ? `Location: ${meetingData.location || 'N/A'}`
    : `Meeting Link: <a href="${meetingData.meetingLink}" target="_blank" rel="noopener noreferrer">${meetingData.meetingLink || 'N/A'}</a>`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #0a1128; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MTUN Deans' Information System</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #0a1128;">🔔 New Meeting Request: ${meetingData.topic}</h2>
        <p>Dear Dean/Administrator,</p>
        <p>A new meeting has been requested for your review and approval.</p>
        
        <h3 style="color: #0a1128;">Meeting Details:</h3>
        <ul>
          <li><strong>Topic:</strong> ${meetingData.topic}</li>
          <li><strong>Date & Time:</strong> ${meetingDateTime}${meetingEndDateTime}</li>
          <li><strong>Type:</strong> ${meetingData.meetingType === 'on-site' ? 'On-site' : 'Online'}</li>
          <li><strong>${meetingData.meetingType === 'on-site' ? 'Location' : 'Link'}:</strong> ${locationOrLink}</li>
          <li><strong>Participants:</strong> ${meetingData.participants}</li>
        </ul>

        <h3 style="color: #0a1128;">Agenda:</h3>
        <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
          ${meetingData.agenda || 'No agenda details provided.'}
        </div>

        <p style="margin-top: 30px;">Please review this request in the portal:</p>
        <p style="text-align: center;">
          <a href="${baseUrl}/dashboard" target="_blank" rel="noopener noreferrer"
             style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Review Request
          </a>
        </p>
        <p style="margin-top: 30px;">Thank you,</p>
        <p>MTUN Deans' System Team</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 0.8em; color: #666;">
        <p>&copy; ${new Date().getFullYear()} MTUN Deans' Information System. All rights reserved.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `🔔 New Meeting Request: ${meetingData.topic}`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(toEmail: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/new-password?token=${token}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #0a1128; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MTUN Deans' Information System</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #0a1128;">🔒 Password Reset Request</h2>
        <p>Dear User,</p>
        <p>We received a request to reset the password for your account. Click the button below to set a new password:</p>
        
        <p style="margin-top: 30px; text-align: center;">
          <a href="${resetLink}" target="_blank" rel="noopener noreferrer"
             style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
        </p>

        <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
          If you did not request a password reset, please ignore this email. This link will expire in 1 hour.
        </p>
        
        <p style="margin-top: 30px;">Thank you,</p>
        <p>MTUN Deans' System Team</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 0.8em; color: #666;">
        <p>&copy; ${new Date().getFullYear()} MTUN Deans' Information System. All rights reserved.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `🔒 Password Reset Request`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendUserWelcomeEmail(toEmail: string, name: string, temporaryPassword: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #0a1128; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MTUN Deans' Information System</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #0a1128;">Welcome to the System, ${name}!</h2>
        <p>Dear ${name},</p>
        <p>Your account has been created by the Super Admin. You can now log in to the MTUN Deans' Information System using the following credentials:</p>
        
        <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; background-color: #f9f9f9; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${toEmail}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <span style="color: #d9534f; font-family: monospace; font-size: 1.2em;">${temporaryPassword}</span></p>
        </div>

        <p style="color: #666; font-style: italic;">Note: For security reasons, please change your password after your first login.</p>

        <p style="margin-top: 30px; text-align: center;">
          <a href="${baseUrl}/login" target="_blank" rel="noopener noreferrer"
             style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Login to Portal
          </a>
        </p>
        
        <p style="margin-top: 30px;">Thank you,</p>
        <p>MTUN Deans' System Team</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 0.8em; color: #666;">
        <p>&copy; ${new Date().getFullYear()} MTUN Deans' Information System. All rights reserved.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `Welcome to MTUN Deans' Information System`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendMeetingStatusEmail(toEmail: string, statusData: MeetingStatusData) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const statusText = statusData.status === MeetingStatus.APPROVED ? 'Approved' : 'Rejected';
  const statusColor = statusData.status === MeetingStatus.APPROVED ? '#28a745' : '#dc3545'; // Green for approved, red for rejected

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #0a1128; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MTUN Deans' Information System</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: ${statusColor};">Meeting Request ${statusText}</h2>
        <p>Dear Staff,</p>
        <p>Your meeting request for the topic "<strong>${statusData.topic}</strong>" has been <strong>${statusText}</strong> by the Dean/Administrator.</p>
        
        <p style="margin-top: 30px;">You can view the meeting details in the portal:</p>
        <p style="text-align: center;">
          <a href="${baseUrl}/dashboard/meetings/${statusData.meetingId}" target="_blank" rel="noopener noreferrer"
             style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            View Meeting
          </a>
        </p>
        <p style="margin-top: 30px;">Thank you,</p>
        <p>MTUN Deans' System Team</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 0.8em; color: #666;">
        <p>&copy; ${new Date().getFullYear()} MTUN Deans' Information System. All rights reserved.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `📢 Meeting Request ${statusText}: ${statusData.topic}`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendMeetingInvitationEmail(toEmail: string, meetingData: MeetingInvitationData) {
  const meetingDateTime = `${meetingData.date.toLocaleDateString()} at ${meetingData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  const meetingEndDateTime = meetingData.endTime ? ` - ${meetingData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` : '';
  const locationOrLink = meetingData.meetingType === 'on-site'
    ? `Location: ${meetingData.location || 'N/A'}`
    : `Meeting Link: <a href="${meetingData.meetingLink}" target="_blank" rel="noopener noreferrer">${meetingData.meetingLink || 'N/A'}</a>`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #0a1128; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MTUN Deans' Information System</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #0a1128;">📅 MTUN Meeting Invitation: ${meetingData.topic}</h2>
        <p>Dear Dean,</p>
        <p>You are invited to an upcoming MTUN meeting.</p>
        
        <h3 style="color: #0a1128;">Meeting Details:</h3>
        <ul>
          <li><strong>Topic:</strong> ${meetingData.topic}</li>
          <li><strong>Hosted by:</strong> ${meetingData.hostUniversityName}</li>
          <li><strong>Date & Time:</strong> ${meetingDateTime}${meetingEndDateTime}</li>
          <li><strong>Type:</strong> ${meetingData.meetingType === 'on-site' ? 'On-site' : 'Online'}</li>
          <li><strong>${meetingData.meetingType === 'on-site' ? 'Location' : 'Link'}:</strong> ${locationOrLink}</li>
        </ul>

        <h3 style="color: #0a1128;">Agenda:</h3>
        <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
          ${meetingData.agenda || 'No agenda details provided.'}
        </div>

        <p style="margin-top: 30px;">We look forward to your attendance.</p>
        <p style="margin-top: 30px;">Thank you,</p>
        <p>MTUN Deans' System Team</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 0.8em; color: #666;">
        <p>&copy; ${new Date().getFullYear()} MTUN Deans' Information System. All rights reserved.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `📅 MTUN Meeting Invitation: ${meetingData.topic}`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}
