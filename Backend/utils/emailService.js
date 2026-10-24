const nodemailer = require('nodemailer');

/**
 * Email Service for JobConnect
 * Handles all email communications including welcome emails, notifications, etc.
 */

// Configure nodemailer transporter
const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Additional security options
        secure: true,
        port: 465,
        tls: {
            rejectUnauthorized: false
        }
    });
};

/**
 * Email Templates
 */
const emailTemplates = {
    welcome: (userName, userRole) => ({
        subject: 'Welcome to JobConnect - Your Journey Starts Here!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to JobConnect!</h1>
                    <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your career journey begins now</p>
                </div>
                
                <div style="padding: 40px 20px; background-color: white;">
                    <h2 style="color: #1e293b; margin: 0 0 20px 0;">Hello ${userName}! 👋</h2>
                    
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                        Welcome to JobConnect, where opportunities meet talent! We're thrilled to have you join our community as a <strong>${userRole}</strong>.
                    </p>
                    
                    ${userRole === 'jobseeker' ? `
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2563eb; margin: 0 0 15px 0;">🚀 Get Started as a Job Seeker:</h3>
                            <ul style="color: #475569; margin: 0; padding-left: 20px;">
                                <li>Complete your profile to attract recruiters</li>
                                <li>Upload your resume for better job matching</li>
                                <li>Browse thousands of job opportunities</li>
                                <li>Apply to jobs that match your skills</li>
                                <li>Save jobs for later and track your applications</li>
                            </ul>
                        </div>
                    ` : `
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2563eb; margin: 0 0 15px 0;">🏢 Get Started as a Recruiter:</h3>
                            <ul style="color: #475569; margin: 0; padding-left: 20px;">
                                <li>Set up your organization profile</li>
                                <li>Post job openings to find the best talent</li>
                                <li>Review applications with AI-powered ATS scoring</li>
                                <li>Manage candidates through the hiring process</li>
                                <li>Connect with qualified professionals</li>
                            </ul>
                        </div>
                    `}
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                            Start Your Journey
                        </a>
                    </div>
                    
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                        <p style="color: #92400e; margin: 0; font-weight: bold;">💡 Pro Tip:</p>
                        <p style="color: #92400e; margin: 5px 0 0 0;">
                            Complete your profile within the first 24 hours to increase your visibility by 3x!
                        </p>
                    </div>
                </div>
                
                <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                        Need help? Contact our support team or visit our help center.
                    </p>
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                        Best regards,<br>
                        <strong>The JobConnect Team</strong>
                    </p>
                </div>
            </div>
        `
    }),

    interview: (applicantName, jobTitle, companyName) => ({
        subject: `🎉 Great News! You're Selected for Interview - ${jobTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 Congratulations!</h1>
                    <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">You've been selected for an interview</p>
                </div>
                
                <div style="padding: 40px 20px; background-color: white;">
                    <h2 style="color: #1e293b; margin: 0 0 20px 0;">Hello ${applicantName}!</h2>
                    
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                        We have exciting news! <strong>${companyName}</strong> has reviewed your application for the <strong>${jobTitle}</strong> position and would like to invite you for an interview.
                    </p>
                    
                    <div style="background-color: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #059669; margin: 0 0 15px 0;">📋 Next Steps:</h3>
                        <ol style="color: #374151; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">Log in to your JobConnect account</li>
                            <li style="margin-bottom: 8px;">Check your messages for interview details</li>
                            <li style="margin-bottom: 8px;">Review the job description and company information</li>
                            <li style="margin-bottom: 8px;">Prepare for your interview</li>
                        </ol>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                            Check Messages
                        </a>
                    </div>
                    
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                        <p style="color: #92400e; margin: 0; font-weight: bold;">💡 Interview Tips:</p>
                        <ul style="color: #92400e; margin: 10px 0 0 0; padding-left: 20px;">
                            <li>Research the company and role thoroughly</li>
                            <li>Prepare examples of your achievements</li>
                            <li>Have questions ready about the role and company</li>
                            <li>Test your technology if it's a virtual interview</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                        Good luck with your interview! We're rooting for you.
                    </p>
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                        Best regards,<br>
                        <strong>The JobConnect Team</strong>
                    </p>
                </div>
            </div>
        `
    }),

    hired: (applicantName, jobTitle, companyName) => ({
        subject: `🎊 Congratulations! You're Hired - ${jobTitle} at ${companyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎊 CONGRATULATIONS! 🎊</h1>
                    <p style="color: #e9d5ff; margin: 10px 0 0 0; font-size: 18px;">You've been hired!</p>
                </div>
                
                <div style="padding: 40px 20px; background-color: white;">
                    <h2 style="color: #1e293b; margin: 0 0 20px 0;">Dear ${applicantName},</h2>
                    
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 18px;">
                        🎉 <strong>Fantastic news!</strong> We're thrilled to inform you that <strong>${companyName}</strong> has decided to offer you the <strong>${jobTitle}</strong> position!
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
                        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 24px;">🏆 Welcome to Your New Journey!</h3>
                        <p style="color: #92400e; margin: 0; font-size: 16px; font-weight: bold;">
                            Your hard work and dedication have paid off!
                        </p>
                    </div>
                    
                    <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #0369a1; margin: 0 0 15px 0;">📋 What's Next:</h3>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">Check your JobConnect messages for detailed offer information</li>
                            <li style="margin-bottom: 8px;">Review the employment terms and conditions</li>
                            <li style="margin-bottom: 8px;">Complete any required onboarding documentation</li>
                            <li style="margin-bottom: 8px;">Prepare for your exciting new role!</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                            View Offer Details
                        </a>
                    </div>
                    
                    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                        <p style="color: #065f46; margin: 0; font-weight: bold;">🌟 Success Story:</p>
                        <p style="color: #065f46; margin: 10px 0 0 0;">
                            You've successfully navigated the hiring process and impressed the team at ${companyName}. 
                            This is just the beginning of an exciting new chapter in your career!
                        </p>
                    </div>
                </div>
                
                <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">
                        🎉 Congratulations once again on this amazing achievement!
                    </p>
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                        We're proud to have been part of your journey.<br>
                        <strong>The JobConnect Team</strong>
                    </p>
                </div>
            </div>
        `
    }),

    rejected: (applicantName, jobTitle, companyName) => ({
        subject: `Update regarding your application for ${jobTitle} at ${companyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #475569 0%, #334155 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">Application Status Update</h1>
                    <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 15px;">${jobTitle} at ${companyName}</p>
                </div>
                
                <div style="padding: 40px 20px; background-color: white;">
                    <h2 style="color: #1e293b; margin: 0 0 20px 0;">Dear ${applicantName},</h2>
                    
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for taking the time to apply for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> through JobConnect.
                    </p>
                    
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                        After careful consideration of your application and profile, we regret to inform you that the recruiter has decided to move forward with other candidates whose qualifications more closely align with the current requirements for this specific role.
                    </p>
                    
                    <div style="background-color: #f1f5f9; border-left: 4px solid #64748b; padding: 20px; border-radius: 4px; margin: 25px 0;">
                        <p style="color: #334155; margin: 0; font-weight: bold;">💪 Keep going!</p>
                        <p style="color: #475569; margin: 8px 0 0 0; font-size: 14px;">
                            This decision is specific to this role and does not reflect on your overall talent and capabilities. We encourage you to continue applying for other exciting opportunities on JobConnect that fit your skill set.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobs" style="background-color: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                            Browse More Jobs
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                        We wish you all the best in your job search and career journey.
                    </p>
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                        Best regards,<br>
                        <strong>The JobConnect Team</strong>
                    </p>
                </div>
            </div>
        `
    }),

    shortlisted: (applicantName, jobTitle, companyName) => ({
        subject: `⭐ You Have Been Shortlisted! - ${jobTitle} at ${companyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">⭐ Great News!</h1>
                    <p style="color: #ddd6fe; margin: 10px 0 0 0; font-size: 16px;">Your application has been shortlisted</p>
                </div>
                
                <div style="padding: 40px 20px; background-color: white;">
                    <h2 style="color: #1e293b; margin: 0 0 20px 0;">Hello ${applicantName}!</h2>
                    
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                        Great news! <strong>${companyName}</strong> has reviewed your profile and shortlisted your application for the <strong>${jobTitle}</strong> position.
                    </p>
                    
                    <div style="background-color: #f3e8ff; border: 2px solid #a855f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #7e22ce; margin: 0 0 10px 0;">🌟 What This Means:</h3>
                        <p style="color: #581c87; margin: 0; font-size: 15px;">
                            Your profile stood out among applicants! The recruitment team is actively considering you for upcoming interview rounds or next steps.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                            View Dashboard
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                        Best regards,<br>
                        <strong>The JobConnect Team</strong>
                    </p>
                </div>
            </div>
        `
    })
};

/**
 * Send welcome email to new users
 */
const sendWelcomeEmail = async (userEmail, userName, userRole) => {
    try {
        const transporter = createEmailTransporter();
        const template = emailTemplates.welcome(userName, userRole);
        
        const mailOptions = {
            from: `"JobConnect Portal" <${process.env.EMAIL_USER}>`,
            to: applicantEmail || userEmail,
            replyTo: process.env.EMAIL_USER,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${applicantEmail || userEmail} | Message ID: ${info.messageId}`);
        return { success: true, message: 'Email sent successfully', messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, message: 'Failed to send welcome email', error: error.message };
    }
};

/**
 * Send interview notification email
 */
const sendInterviewEmail = async (applicantEmail, applicantName, jobTitle, companyName) => {
    try {
        const transporter = createEmailTransporter();
        const template = emailTemplates.interview(applicantName, jobTitle, companyName);
        
        const mailOptions = {
            from: `"JobConnect" <${process.env.EMAIL_USER}>`,
            to: applicantEmail,
            replyTo: process.env.EMAIL_USER,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Interview email sent successfully to ${applicantEmail} | Message ID: ${info.messageId}`);
        return { success: true, message: 'Interview email sent successfully', messageId: info.messageId };
    } catch (error) {
        console.error('Error sending interview email:', error);
        return { success: false, message: 'Failed to send interview email', error: error.message };
    }
};

/**
 * Send hired notification email
 */
const sendHiredEmail = async (applicantEmail, applicantName, jobTitle, companyName) => {
    try {
        const transporter = createEmailTransporter();
        const template = emailTemplates.hired(applicantName, jobTitle, companyName);
        
        const mailOptions = {
            from: `"JobConnect" <${process.env.EMAIL_USER}>`,
            to: applicantEmail,
            replyTo: process.env.EMAIL_USER,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Hired email sent successfully to ${applicantEmail} | Message ID: ${info.messageId}`);
        return { success: true, message: 'Hired email sent successfully', messageId: info.messageId };
    } catch (error) {
        console.error('Error sending hired email:', error);
        return { success: false, message: 'Failed to send hired email', error: error.message };
    }
};

/**
 * Send rejected notification email
 */
const sendRejectedEmail = async (applicantEmail, applicantName, jobTitle, companyName) => {
    try {
        const transporter = createEmailTransporter();
        const template = emailTemplates.rejected(applicantName, jobTitle, companyName);
        
        const mailOptions = {
            from: `"JobConnect" <${process.env.EMAIL_USER}>`,
            to: applicantEmail,
            replyTo: process.env.EMAIL_USER,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Rejected email sent successfully to ${applicantEmail} | Message ID: ${info.messageId}`);
        return { success: true, message: 'Rejected email sent successfully', messageId: info.messageId };
    } catch (error) {
        console.error('Error sending rejected email:', error);
        return { success: false, message: 'Failed to send rejected email', error: error.message };
    }
};

/**
 * Send shortlisted notification email
 */
const sendShortlistedEmail = async (applicantEmail, applicantName, jobTitle, companyName) => {
    try {
        const transporter = createEmailTransporter();
        const template = emailTemplates.shortlisted(applicantName, jobTitle, companyName);
        
        const mailOptions = {
            from: `"JobConnect" <${process.env.EMAIL_USER}>`,
            to: applicantEmail,
            replyTo: process.env.EMAIL_USER,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Shortlisted email sent successfully to ${applicantEmail} | Message ID: ${info.messageId}`);
        return { success: true, message: 'Shortlisted email sent successfully', messageId: info.messageId };
    } catch (error) {
        console.error('Error sending shortlisted email:', error);
        return { success: false, message: 'Failed to send shortlisted email', error: error.message };
    }
};

module.exports = {
    createEmailTransporter,
    sendWelcomeEmail,
    sendInterviewEmail,
    sendHiredEmail,
    sendRejectedEmail,
    sendShortlistedEmail,
    emailTemplates
};
