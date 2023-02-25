import { createRoot } from 'react-dom/client';
import { ConfigProvider, Message } from '@arco-design/web-react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faClock,
  faCheckCircle,
  faPauseCircle,
  faXmarkCircle,
  faCircleArrowDown,
  faSquareCheck,
  faScaleBalanced,
  faTrophy,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import Routes from './route';
import GlobalStateComponent from './store/provider';
import './root.scss?raw';

library.add(
  faClock,
  faCheckCircle,
  faPauseCircle,
  faXmarkCircle,
  faCircleArrowDown,
  faSquareCheck,
  faSquare,
  faScaleBalanced,
  faTrophy,
  faSpinner
);

const globalMessageContainer = document.getElementById('global-message') || document.body;

Message.config({
  maxCount: 3,
  duration: 2000,
  getContainer: () => globalMessageContainer
});

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <GlobalStateComponent>
      <ConfigProvider
        autoInsertSpaceInButton
        componentConfig={{
          Modal: {
            closable: false
          },
          Pagination: {
            hideOnSinglePage: true
          },
          'List.Item': {
            style: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }
        }}
      >
        <Routes />
      </ConfigProvider>
    </GlobalStateComponent>
  );
}
