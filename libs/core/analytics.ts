/* eslint-disable */
export class Analytics {
  public static registerEvent(event: AnalyticsEvent) {
    const evt = new CustomEvent('analytics_registerEvent', { detail: event });
    window.dispatchEvent(evt);
  }
}

export class AnalyticsEvent {
  category: string;
  action: string;
  name: string;
  value: number;
  dimensions: any;

  constructor(item) {
    this.category = item.category;
    this.action = item.action;
    this.name = item.name;
    this.value = item.value;
    this.dimensions = item.dimensions;
  }
}
