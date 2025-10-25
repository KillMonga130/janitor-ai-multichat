export class ContextManager {
  constructor() {
    this.rooms = new Map(); // roomId -> { history: [], groupSummary: '', userNotes: Map, users: Set }
    this.maxHistory = 40; // last N messages to include verbatim
  }

  ensureRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { history: [], groupSummary: '', userNotes: new Map(), users: new Set() });
    }
    return this.rooms.get(roomId);
  }

  addUserMessage(roomId, user, content) {
    const room = this.ensureRoom(roomId);
    room.history.push({ role: 'user', name: user?.name || user?.id || 'User', content });
    this.trim(room);
  }

  addAssistantMessage(roomId, content) {
    const room = this.ensureRoom(roomId);
    room.history.push({ role: 'assistant', content });
    this.trim(room);
  }

  updateUserNote(roomId, userName, bullets) {
    const room = this.ensureRoom(roomId);
    room.userNotes.set(userName, bullets);
  }

  setGroupSummary(roomId, summary) {
    const room = this.ensureRoom(roomId);
    room.groupSummary = summary;
  }

  addUserPresence(roomId, userName) {
    const room = this.ensureRoom(roomId);
    room.users.add(userName);
  }

  removeUserPresence(roomId, userName) {
    const room = this.ensureRoom(roomId);
    room.users.delete(userName);
  }

  listUsers(roomId) {
    const room = this.ensureRoom(roomId);
    return Array.from(room.users);
  }

  getSystemPrompt() {
    return {
      role: 'system',
      content: 'You are Nomi, a witty AI character in a shared chatroom. Keep track of user personalities and maintain coherent group conversations. Be concise, friendly, and fun. Use @mentions when addressing someone directly.'
    };
  }

  buildMessages(roomId) {
    const room = this.ensureRoom(roomId);
    const messages = [];
    messages.push(this.getSystemPrompt());
    if (room.groupSummary) {
      messages.push({ role: 'assistant', content: `Group Summary: ${room.groupSummary}` });
    }
    const recent = room.history.slice(-this.maxHistory);
    return messages.concat(recent);
  }

  trim(room) {
    // Simple bound by count; swap for token-aware trim if needed
    const cap = Math.max(this.maxHistory * 2, 200);
    if (room.history.length > cap) {
      room.history = room.history.slice(-cap);
    }
  }
}
