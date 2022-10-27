import QRCode from 'qrcode';

export const generateQRCode = async (info: string): Promise<string> => {
    return await QRCode.toDataURL(info);
}
