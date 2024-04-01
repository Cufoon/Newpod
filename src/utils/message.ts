import Message, { MessageProps } from '@arco-design/web-react/es/Message';
import type { MessageType as CloserType } from '@arco-design/web-react/es/Message';
import React from 'react';

class MessageLoading {
  canShowDelayLoading = true;
  closer: CloserType | undefined;
  delay: number;
  timerId: NodeJS.Timeout | undefined;

  constructor(delay: number) {
    this.delay = delay;
  }

  loading(content?: string) {
    this.canShowDelayLoading = false;
    this.timerId && clearTimeout(this.timerId);
    this.closer?.();
    this.timerId = undefined;
    this.closer = undefined;
    this.canShowDelayLoading = true;
    this.timerId = setTimeout(() => {
      if (this.canShowDelayLoading) {
        this.closer = GlobalMessage.loading(content || '加载中', 60000);
      }
    }, this.delay);
  }

  hide() {
    this.canShowDelayLoading = false;
    this.timerId && clearTimeout(this.timerId);
    setTimeout(() => {
      this.closer?.();
      this.timerId = undefined;
      this.closer = undefined;
    }, 100);
  }

  success(content: string) {
    this.hide();
    GlobalMessage.success(content);
  }

  error(content: string) {
    this.hide();
    GlobalMessage.error(content);
  }

  info(content: string) {
    this.hide();
    GlobalMessage.error(content);
  }
}

export const createMessageLoading = (delay = 1000) => {
  if (delay === undefined) {
    delay = 1000;
  } else {
    if (delay < 20) {
      delay = 20;
    }
  }
  return new MessageLoading(delay);
};

const convertMessageFunc = (
  fn: (config: string | MessageProps) => CloserType
) => {
  return (content: string | React.JSX.Element, duration = 2000) => {
    return fn({
      content,
      className: 'custom-antd-message-style',
      duration
    });
  };
};

export const GlobalMessage = {
  success: convertMessageFunc(Message.success),
  error: convertMessageFunc(Message.error),
  info: convertMessageFunc(Message.info),
  warning: convertMessageFunc(Message.warning),
  loading: convertMessageFunc(Message.loading)
};
