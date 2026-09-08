import { Request, Response } from 'express';
import { storeService } from '../services/storeService';

export const getMessages = (req: Request, res: Response): void => {
  try {
    const { matchId } = req.params;
    if (!matchId) {
      res.status(400).json({ success: false, message: 'matchId is required' });
      return;
    }

    const messages = storeService.getMessages(matchId);
    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error });
  }
};

export const sendMessage = (req: Request, res: Response): void => {
  try {
    const { matchId, text } = req.body;
    if (!matchId || !text || !text.trim()) {
      res.status(400).json({ success: false, message: 'matchId and non-empty text are required' });
      return;
    }

    const message = storeService.sendMessage(matchId, text.trim());
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error });
  }
};
