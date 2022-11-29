/* eslint-disable */
import { AppPage } from './app.po';

describe('MC Underwriting App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('App title: should display "Moneycare CRM"', () => {
    page.navigateTo1600px('/');
    expect(page.getAppTitle()).toEqual('Moneycare CRM');
  });

  it('Partner list > add item button: should lead to new partner form', () => {
    page.navigateTo1600px('/partners');
    page.getAddItemButton().click();
    expect(page.getItemCardTitle()).toEqual('Добавить партнера');
  });
});
