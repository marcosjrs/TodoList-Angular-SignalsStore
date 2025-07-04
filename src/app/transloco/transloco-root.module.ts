import { isDevMode } from '@angular/core';
import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco-http-loader';

export const translocoConfig = provideTransloco({
  config: {
    availableLangs: ['en', 'es', 'gl'],
    defaultLang: 'en',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
});

export const TranslocoRootModule = TranslocoModule;
