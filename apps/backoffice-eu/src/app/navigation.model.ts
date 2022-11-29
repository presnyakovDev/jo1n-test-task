export class NavigationModel {
  public model: any[];

  constructor(menuItems: any[]) {
    this.model = [...menuItems];
  }
}
