import { QR } from '../database/models/qr';

class QRService {
    async getAllQRs() {
        const qrs = await QR.findAll();
        return qrs;
    }
}

export default new QRService();
