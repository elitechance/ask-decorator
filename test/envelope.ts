export function envelope(request: any) {
  return {
    version: '1.0',
    session: {
      new: true,
      sessionId: 'amzn1.echo-api.session.test',
      application: { applicationId: 'amzn1.ask.skill.test' },
      user: { userId: 'amzn1.ask.account.test' },
      attributes: {},
    },
    context: {
      System: {
        application: { applicationId: 'amzn1.ask.skill.test' },
        user: { userId: 'amzn1.ask.account.test' },
        device: { deviceId: 'amzn1.ask.device.test', supportedInterfaces: {} },
        apiEndpoint: 'https://api.amazonalexa.com',
      },
    },
    request: {
      requestId: 'amzn1.echo-api.request.test',
      timestamp: '2026-01-01T00:00:00Z',
      locale: 'en-US',
      ...request,
    },
  };
}

export const intentRequest = (name: string) =>
  envelope({ type: 'IntentRequest', dialogState: 'COMPLETED', intent: { name, confirmationStatus: 'NONE' } });

export const launchRequest = () => envelope({ type: 'LaunchRequest' });

export const sessionEndedRequest = () => envelope({ type: 'SessionEndedRequest', reason: 'USER_INITIATED' });

export const speech = (response: any) => response.response.outputSpeech.ssml;
