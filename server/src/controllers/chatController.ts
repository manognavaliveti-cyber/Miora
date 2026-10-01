import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { firestoreMatchService } from '../services/firestoreMatchService';
import { storeService } from '../services/storeService';

export const getMessages = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || 'user_me';
    const { matchId } = req.params;
    if (!matchId) {
      res.status(400).json({ success: false, message: 'matchId is required' });
      return;
    }

    let messages = await firestoreMatchService.getMessages(userId, matchId);
    if (messages.length === 0 && userId === 'user_me') {
      messages = storeService.getMessages(matchId);
    }

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error: any) {
    console.error('getMessages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error?.message });
  }
};

export const sendMessage = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || 'user_me';
    const { matchId, text } = req.body;
    if (!matchId || !text || !text.trim()) {
      res.status(400).json({ success: false, message: 'matchId and non-empty text are required' });
      return;
    }

    let message;
    try {
      message = await firestoreMatchService.sendMessage(userId, matchId, text.trim());
    } catch (fsErr) {
      console.warn('Firestore sendMessage failed, falling back to storeService:', fsErr);
      message = storeService.sendMessage(matchId, text.trim());
    }

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error: any) {
    console.error('sendMessage error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error?.message });
  }
};

export const deleteMessage = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || 'user_me';
    const { matchId, messageId } = req.params;
    if (!matchId || !messageId) {
      res.status(400).json({ success: false, message: 'matchId and messageId are required' });
      return;
    }

    let deleted = false;
    try {
      deleted = await firestoreMatchService.deleteMessage(userId, matchId, messageId);
    } catch {
      deleted = storeService.deleteMessage(matchId, messageId);
    }

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error('deleteMessage error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message', error: error?.message });
  }
};
