import sgMail from '@sendgrid/mail';

// @ts-ignore
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface IAttachment {
    content: string,
    filename: string,
    type: string,
    disposition?: string,
}

interface IMessage {
    to: string;
    subject: string;
    html: string;
    attachments?: IAttachment[];
}

export const sendEmail = async (message: IMessage) => {
    message.attachments?.forEach((attachment) => attachment.disposition = 'attachment');

    return await sgMail.send({
        // @ts-ignore
        from: process.env.SENDGRID_SENDER,
        attachDataUrls: true,
        ...message,
    });
}
