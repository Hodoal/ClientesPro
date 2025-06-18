const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar email genérico
exports.sendEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log('Email enviado: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error enviando email: ', error);
    throw error;
  }
};

// Enviar email de bienvenida
exports.sendWelcomeEmail = async (user) => {
  const message = `
    <h1>¡Bienvenido a ClientesPro!</h1>
    <p>Hola ${user.name},</p>
    <p>Gracias por registrarte en ClientesPro. Ahora puedes gestionar todos tus clientes de manera eficiente.</p>
    <p>¡Comienza a agregar tus primeros clientes!</p>
    <br>
    <p>Saludos,</p>
    <p>El equipo de ClientesPro</p>
  `;

  await this.sendEmail({
    email: user.email,
    subject: '¡Bienvenido a ClientesPro!',
    html: message
  });
};

// Enviar email de recuperación de contraseña
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <h1>Recuperación de Contraseña</h1>
    <p>Hola ${user.name},</p>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
    <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
    <p>Este enlace expira en 10 minutos.</p>
    <br>
    <p>Saludos,</p>
    <p>El equipo de ClientesPro</p>
  `;

  await this.sendEmail({
    email: user.email,
    subject: 'Recuperación de Contraseña - ClientesPro',
    html: message
  });
};
