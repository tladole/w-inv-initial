import { WogoPage } from './app.po';

describe('wogo App', () => {
  let page: WogoPage;

  beforeEach(() => {
    page = new WogoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
