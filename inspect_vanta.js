import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:5173/bryanisimo/', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const card = document.querySelector('.group.relative');
    if (card) {
      const event = new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      card.dispatchEvent(event);
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  page.on('console', msg => {
    if(msg.type() === 'log') console.log('EFFECT PROPS:', msg.text());
  });

  await page.evaluate(() => {
    // we need to access the ref... since we can't easily, we can just look at the global window if we expose it
  });

  await browser.close();
})();
