// Runs before paint. No UI copy belongs here.
export const themeBootstrap =
  "(()=>{let t;try{t=localStorage.getItem('ignitra-theme')}catch{}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()";
