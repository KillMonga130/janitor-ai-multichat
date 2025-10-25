// Rough token estimator; replace with tiktoken if needed
export function estimateTokens(text) {
  if (!text) return 0;
  const chars = ('' + text).length;
  return Math.ceil(chars / 4);
}
