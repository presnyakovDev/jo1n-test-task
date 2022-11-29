/* eslint-disable */
import { browser, by, element } from 'protractor';

const fs = require('fs');

export function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(Buffer.from(data, 'base64'));
  stream.end();
}

export class AppPage {
  takeScreenshot(name: string) {
    browser.takeScreenshot().then(function (png) {
      writeScreenShot(png, name);
    });
  }

  navigateTo1600px(url: string) {
    const width = 1600;
    const height = 900;
    browser.driver.manage().window().setSize(width, height);
    return browser.get(url);
  }

  navigateTo375px(url: string) {
    const width = 375;
    const height = 667;
    browser.driver.manage().window().setSize(width, height);
    return browser.get(url);
  }

  getAddItemButton() {
    return element(by.css('button.add-item-button'));
  }

  getItemCardTitle() {
    return element(by.css('div.h1')).getText();
  }

  getAppTitle() {
    return browser.getTitle();
  }

  getMobilePageTitle() {
    return element(by.css('div.app-title')).getText();
  }
}
