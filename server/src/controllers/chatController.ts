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

export const deleteMessage = (req: Request, res: Response): void => {
  try {
    const { matchId, messageId } = req.params;
    if (!matchId || !messageId) {
      res.status(400).json({ success: false, message: 'matchId and messageId are required' });
      return;
    }
    const deleted = storeService.deleteMessage(matchId, messageId);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message', error });
  }
};
