import { App } from './App';

(async () => {
  const app = new App()

  app.start();
})()
  .then(r => console.log(r))
  .catch(e => console.log(e));