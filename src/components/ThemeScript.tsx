export function ThemeScript() {
  const script = `(function(){try{
    var s=localStorage.getItem('koris-theme');
    var d=document.documentElement;
    var isLight = s === 'light' || (!s && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
    if(isLight){
      d.classList.add('light');
      d.classList.remove('dark');
      d.setAttribute('data-theme','light');
    }else{
      d.classList.add('dark');
      d.classList.remove('light');
      d.setAttribute('data-theme','dark');
    }
  }catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
