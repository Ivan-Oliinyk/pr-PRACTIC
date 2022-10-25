import { INestApplication } from '@nestjs/common';

declare const module: any;

export function setupHotReload(app: INestApplication) {
  if (module.hot) {
    console.log('module');
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
