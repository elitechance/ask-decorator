import { SkillBuilders, HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

import { AskIntent } from './ask-intent';

export class AskDecorator {
  private static _instance: AskDecorator;

  private intents: AskIntent[] = [];
  private requestInterceptors: string[] = [];
  private responseInterceptors: string[] = [];
  private skill: any;
  private targetInstance: any;

  set requestInterceptor(value: string) {
    this.requestInterceptors.push(value);
  }

  set responseInterceptor(value: string) {
    this.responseInterceptors.push(value);
  }

  private _launchRequestMethod: string;
  set launchRequestMethod(value: string) {
    this._launchRequestMethod = value;
  }
  get launchRequestMethod() {
    return this._launchRequestMethod;
  }

  private _errorHandlerMethod: string;
  set errorHandlerMethod(value: string) {
    this._errorHandlerMethod = value;
  }
  get errorHandlerMethod() {
    return this._errorHandlerMethod;
  }

  private _sessionEndRequestMethod: string;
  set sessionEndedRequestMethod(value: string) {
    this._sessionEndRequestMethod = value;
  }
  get sessionEndedRequestMethod() {
    return this._sessionEndRequestMethod;
  }

  private _defaultIntentHandler: string;
  set defaultIntentHandler(value: string) {
    this._defaultIntentHandler = value;
  }
  get defaultIntentHandler() {
    return this._defaultIntentHandler;
  }

  private _postConstructorMethod: string;
  set postConstructorMethod(value: string) {
    this._postConstructorMethod = value;
  }
  get postConstructorMethod() {
    return this._postConstructorMethod;
  }

  private _event: any;
  set event(value: any) {
    this._event = value;
  }
  get event() {
    return this._event;
  }
  private _eventProperty: any;
  set eventProperty(value: any) {
    this._eventProperty = value;
  }
  get eventProperty() {
    return this._eventProperty;
  }

  private _context: any;
  set context(value: any) {
    this._context = value;
  }
  get context() {
    return this._context;
  }
  private _contextProperty: any;
  set contextProperty(value: any) {
    this._contextProperty = value;
  }
  get contextProperty() {
    return this._contextProperty;
  }

  private _callback: any;
  set callback(value: any) {
    this._callback = value;
  }
  get callback() {
    return this._callback;
  }
  private _callbackProperty: any;
  set callbackProperty(value: any) {
    this._callbackProperty = value;
  }
  get callbackProperty() {
    return this._callbackProperty;
  }

  private _target: any;
  set target(value: any) {
    if (!this._target) {
      this._target = value;
    }
  }
  get target() {
    return this._target;
  }

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  static async handler(event: any, context: any, callback: Function) {
    const ask = AskDecorator.Instance;
    return await ask.processRequest(event, context, callback);
  }

  private getTargetInstance() {
    if (!this.targetInstance) {
      this.targetInstance = new this.target.constructor();
    }
    return this.targetInstance;
  }

  private hasErrorHandler() {
    if (this.errorHandlerMethod) {
      return true;
    }
    return false;
  }

  private setLambdaParams() {
    if (this.callbackProperty) {
      this.getTargetInstance()[this.callbackProperty] = this.callback;
    }
    if (this.eventProperty) {
      this.getTargetInstance()[this.eventProperty] = this.event;
    }
    if (this.contextProperty) {
      this.getTargetInstance()[this.contextProperty] = this.context;
    }
  }

  private runPostConstructor() {
    if (this.postConstructorMethod) {
      this.getTargetInstance()[this.postConstructorMethod]();
    }
  }

  private requestInterceptorHandler(handlerInput: HandlerInput) {
    for (const interceptor of this.requestInterceptors) {
      this.getTargetInstance()[interceptor](handlerInput);
    }
  }

  private responseInterceptorHandler(handlerInput: HandlerInput) {
    for (const interceptor of this.responseInterceptors) {
      this.getTargetInstance()[interceptor](handlerInput);
    }
  }

  private async processRequest(event: any, context: any, callback: Function) {
    this.event = event;
    this.context = context;
    this.callback = callback;
    this.setLambdaParams();
    this.runPostConstructor();
    if (!this.skill) {
      this.skill = SkillBuilders.custom()
        .addRequestInterceptors({
          process: this.requestInterceptorHandler.bind(this)
        })
        .addResponseInterceptors({
          process: this.responseInterceptorHandler.bind(this)
        })
        .addRequestHandlers({
          canHandle: this.hasRequestHandler.bind(this),
          handle: this.requestHandler.bind(this)
        })
        .addErrorHandlers({
          canHandle: this.hasErrorHandler.bind(this),
          handle: this.errorHandler.bind(this)
        })
        .create();
    }
    const response = await this.skill.invoke(event, context);
    return response;
  }

  addIntent(intentName: string | string[], target: Function, methodName) {
    this.target = target;
    this.intents.push({
      intent: intentName,
      methodName: methodName
    });
  }

  private hasIntent(intentName) {
    for (const intentInfo of this.intents) {
      if (typeof intentInfo.intent === 'string') {
        if (intentInfo.intent === intentName) {
          return true;
        }
      } else {
        for (const name of intentInfo.intent) {
          if (name === intentName) {
            return true;
          }
        }
      }
    }
    if (this.defaultIntentHandler) {
      return true;
    }
    return false;
  }

  private hasLaunchRequestMethod() {
    if (this.launchRequestMethod) {
      return true;
    }
    return false;
  }

  private hasSessionEndedRequest() {
    if (this.sessionEndedRequestMethod) {
      return true;
    }
    return false;
  }

  private hasRequestHandler(handlerInput: HandlerInput) {
    const requestType = handlerInput.requestEnvelope.request.type;
    switch (requestType) {
      case 'IntentRequest':
        const intentName = handlerInput.requestEnvelope.request['intent'].name;
        return this.hasIntent(intentName);
      case 'LaunchRequest':
        return this.hasLaunchRequestMethod();
      case 'SessionEndedRequest':
        return this.hasSessionEndedRequest();
      default:
        return false;
    }
  }

  private errorHandler(handlerInput: HandlerInput, error: Error): Response {
    const target = this.getTargetInstance();
    return target[this.errorHandlerMethod](handlerInput, error);
  }

  private targetHandleIntent(handlerInput: HandlerInput, intent: AskIntent) {
    const target = this.getTargetInstance();
    return target[intent.methodName](handlerInput);
  }

  private handleIntent(handlerInput: HandlerInput, intentName: string) {
    for (const intentInfo of this.intents) {
      if (typeof intentInfo.intent === 'string') {
        if (intentInfo.intent === intentName) {
          return this.targetHandleIntent(handlerInput, intentInfo);
        }
      } else {
        for (const name of intentInfo.intent) {
          if (name === intentName) {
            return this.targetHandleIntent(handlerInput, intentInfo);
          }
        }
      }
    }
    if (this.defaultIntentHandler) {
      const target = this.getTargetInstance();
      return target[this.defaultIntentHandler](handlerInput);
    }
  }

  private targetLaunchRequest(handlerInput: HandlerInput) {
    const target = this.getTargetInstance();
    return target[this.launchRequestMethod](handlerInput);
  }

  private targetSessionEndedRequest(handlerInput: HandlerInput) {
    const target = this.getTargetInstance();
    return target[this.sessionEndedRequestMethod](handlerInput);
  }

  private requestHandler(handlerInput: HandlerInput) {
    const requestType = handlerInput.requestEnvelope.request.type;
    switch (requestType) {
      case 'IntentRequest':
        const intentName = handlerInput.requestEnvelope.request['intent'].name;
        return this.handleIntent(handlerInput, intentName);
      case 'LaunchRequest':
        return this.targetLaunchRequest(handlerInput);
      case 'SessionEndedRequest':
        return this.targetSessionEndedRequest(handlerInput);
      default:
        return null;
    }
  }
}
