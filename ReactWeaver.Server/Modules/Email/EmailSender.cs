using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ReactWeaver.Server.Modules.Users;

namespace ReactWeaver.Server.Modules.Email;

public sealed class EmailSender(IOptions<SmtpOptions> options, IConfiguration configuration) : IEmailSender<User>
{
    private readonly SmtpOptions _options = options.Value;

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        string? username = configuration["SmtpOptions:Username"];
        string? password = configuration["SmtpOptions:Password"];

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException("SmtpOptions:Username and SmtpOptions:Password must be configured. For Gmail, use an App Password (not your regular password).");
        }

        using MailMessage message = new() { From = new MailAddress(username) };
        message.To.Add(email);
        message.Body = htmlMessage;
        message.Subject = subject;
        message.IsBodyHtml = true;

        using SmtpClient client = new(_options.Server, _options.Port);
        client.EnableSsl = _options.EnableSSL;
        client.Credentials = new NetworkCredential(username, password);

        await client.SendMailAsync(message);
    }

    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        string subject = "Welcome! Confirm your account";
        string body = $@"
            <h1>Hello {user.UserName},</h1>
            <p>Thank you for signing up. Click the link below to activate your account:</p>
            <p><a href='{confirmationLink}'>Confirm my account</a></p>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetLinkAsync(User _, string email, string resetLink)
    {
        string subject = "Password Reset";
        string body = $@"
            <p>To reset your password, click here:</p>
            <p><a href='{resetLink}'>Reset Password</a></p>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetCodeAsync(User _, string email, string resetCode)
    {
        string subject = "Password Reset Code";
        string body = $"Your reset code is: {resetCode}";

        await SendEmailAsync(email, subject, body);
    }
}
