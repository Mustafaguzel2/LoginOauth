import { mailtrapClient, sender } from "../config/mailtrap.js";
import { logger } from "./logger.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Verification Email",
    });
    logger.info(`Verification email sent to ${email}`);
    return response;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "dc708472-5684-4061-b143-39be545aee3e",
      template_variables: {
        company_info_name: "MYG Devs",
        name: name,
      },
    });
    logger.info(`Welcome email sent to ${email}`);
    return response;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset Email",
    });
    logger.info(`Password reset email sent to ${email}`);
    return response;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success Email",
    });
    logger.info(`Password reset success email sent to ${email}`);
    return response;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to send password reset success email");
  }
};
