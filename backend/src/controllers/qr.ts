import { Request, Response, NextFunction } from 'express';
import QRService from '../services/qr';
import { QR } from '../database/models/qr';

class QRController {
    async getAllQRs(req: Request, res: Response, next: NextFunction) {
        try {
            const files = await QRService.getAllQRs();
            return res.json(files);
        } catch (e) {
            next(e);
        }
    }
    async blockQR(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.params.id);
            const id = Number(req.params.id);
            const qr = await QR.findByPk(id);
            if (!qr) return;
            qr.is_blocked = !qr.is_blocked;
            await qr.save();
            return res.json(qr);
        } catch (e) {
            next(e);
        }
    }
}

export default new QRController();
