import { DEFAULT_LOCALE, LOCALES, LOCALE_STORAGE_KEY } from '@/i18n/locales';

const NON_DEFAULT = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/**
 * First-visit language detection, English tree only.
 *
 * Static export rules out server-side negotiation (Proxy is unsupported under
 * `output: 'export'`), so this runs in the browser. It is deliberately narrow:
 * only when nothing is stored, only from the English tree, and `replace` so the
 * Back button still leaves. Any explicit choice in the switcher wins forever.
 *
 * Inlined before paint to keep the English flash as short as possible.
 */
export function LocaleRedirect() {
  const script = `(function(){try{
    if(localStorage.getItem('${LOCALE_STORAGE_KEY}'))return;
    var p=location.pathname;
    var locales=${JSON.stringify(NON_DEFAULT)};
    for(var i=0;i<locales.length;i++){if(p==='/'+locales[i]||p.indexOf('/'+locales[i]+'/')===0)return;}
    var want=(navigator.language||'').toLowerCase();
    for(var j=0;j<locales.length;j++){
      var base=locales[j].split('-')[0];
      if(want===locales[j]||want.indexOf(base+'-')===0||want===base){
        location.replace('/'+locales[j]+(p==='/'?'/':p)+location.search+location.hash);
        return;
      }
    }
  }catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
