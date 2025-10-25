export class ResponseScheduler {
  constructor() {
    this.lastAIResponse = Date.now();
    this.messagesSinceAI = 0;
    this.silenceThreshold = 15000; // ms
  }

  recordHumanMessage() {
    this.messagesSinceAI++;
  }

  shouldRespond(newMessage) {
    const timeSinceLastAI = Date.now() - this.lastAIResponse;
    const content = newMessage?.content || '';
    const direct = /@Nomi/i.test(content);
    const isQuestion = /\?$/.test(content) || /nomi\b/i.test(content);

    return (
      direct ||
      this.messagesSinceAI >= 3 ||
      timeSinceLastAI > this.silenceThreshold ||
      isQuestion
    );
  }

  markAIResponded() {
    this.lastAIResponse = Date.now();
    this.messagesSinceAI = 0;
  }
}
