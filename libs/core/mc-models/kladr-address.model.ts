/* eslint-disable */
export class KladrAddress {
  regionCode: string;
  region: string;
  regionType: string;

  districtCode: string;
  district: string;
  districtType: string;

  townCode: string;
  town: string;
  townType: string;

  localityCode: string;
  locality: string;
  localityType: string;
  localityTypeCode: string;

  streetCode: string;
  street: string;
  streetType: string;
  streetTypeCode: string;

  zip: string;

  houseNumber: string;
  houseType: string;

  blockNumber: string;
  blockType: string;

  buildingNumber: string;
  buildingType: string;

  flatNumber: string;
  flatType: string;

  address: string;

  public static getFieldNames() {
    return {
      zip: 'Почтовый индекс',
      regionCode: 'Регион',
      districtCode: 'Район',
      townCode: 'Город',
      localityCode: 'Населенный пункт',
      streetCode: 'Улица',
      houseNumber: 'Дом',
      blockNumber: 'Корпус',
      buildingNumber: 'Строение',
      flatNumber: 'Квартира',
    };
  }

  public static convertDadataToKladr(addr: any): KladrAddress {
    const res = new KladrAddress({});
    const data = addr.data;

    res.address = addr.value;
    res.zip = addr.data.postal_code;

    res.region = data.region;
    res.regionCode = data.region_kladr_id ? data.region_kladr_id.substr(0, 2) : null;
    res.regionType = data.region_type;

    res.district = data.area;
    res.districtCode = data.area_kladr_id ? data.area_kladr_id.substr(2, 3) : null;
    res.districtType = data.area_type;

    res.town = data.city;
    res.townCode = data.city_kladr_id ? data.city_kladr_id.substr(5, 3) : null;
    res.townType = data.city_type;

    if (data.settlement_type !== 'мкр' || !data.city) {
      res.locality = data.settlement;
      res.localityCode = data.settlement_kladr_id ? data.settlement_kladr_id.substr(8, 3) : null;
      res.localityType = data.settlement_type;
    }

    res.street = data.street;
    res.streetCode = data.street_kladr_id ? data.street_kladr_id.substr(11, 4) : null;
    res.streetType = data.street_type;

    if (!data.street && data.settlement_type === 'мкр') {
      res.street = data.settlement;
      res.streetCode = '0001';
      res.streetType = data.settlement_type;
    }

    res.houseNumber = data.house;
    res.houseType = data.house_type;

    res.blockNumber = data.block;
    res.blockType = data.block_type;

    res.buildingNumber = data.building || null;
    res.buildingType = data.building_type || null;

    res.flatNumber = data.flat;
    res.flatType = data.flat_type;
    return res;
  }

  constructor(item) {
    if (!item) {
      item = {};
    }

    this.region = item.region || null;
    this.regionCode = item.regionCode || null;
    this.regionType = item.regionType || null;

    this.district = item.district || null;
    this.districtCode = item.districtCode || null;
    this.districtType = item.districtType || null;

    this.town = item.town || null;
    this.townCode = item.townCode || null;
    this.townType = item.townType || null;

    this.locality = item.locality || null;
    this.localityCode = item.localityCode || null;
    this.localityType = item.localityType || null;
    this.localityTypeCode = item.localityTypeCode || null;

    this.street = item.street || null;
    this.streetCode = item.streetCode || null;
    this.streetType = item.streetType || null;
    this.streetTypeCode = item.streetTypeCode || null;

    if (!this.district && !this.districtType && this.districtCode === '000') {
      this.districtCode = null;
    }

    if (!this.town && !this.townType && this.townCode === '000') {
      this.townCode = null;
    }

    if (!this.locality && !this.localityType && this.localityCode === '000') {
      this.localityCode = null;
    }

    this.houseNumber = item.houseNumber || null;
    this.houseType = item.houseType || null;

    this.blockNumber = item.blockNumber || null;
    this.blockType = item.blockType || null;

    this.buildingNumber = item.buildingNumber || null;
    this.buildingType = item.buildingType || null;

    this.flatNumber = item.flatNumber || null;
    this.flatType = item.flatType || null;

    this.address = this.getAddress();
    this.zip = item.zip || null;
  }

  getCityOrLocality(): string {
    if (this.town) {
      return this.town + (this.townType ? ' ' + this.townType : '');
    }
    if (this.locality) {
      return this.locality + (this.localityType ? ' ' + this.localityType : '');
    }
  }

  getCityOrLocalityV2(): string {
    if (this.town) {
      return (this.townType ? this.townType + '. ' : '') + this.town;
    }
    if (this.locality) {
      return (this.localityType ? this.localityType + '. ' : '') + this.locality;
    }
  }

  getAddress(): string {
    const zipCode = this.zip ? this.zip + ', ' : '';
    const regionTitle = this.region ? this.region + (this.regionType ? ' ' + this.regionType : '') : '';
    const districtTitle = this.district
      ? ', ' + this.district + (this.districtType ? ' ' + this.districtType : '')
      : '';
    const townTitle = this.town ? ', ' + this.town + (this.townType ? ' ' + this.townType : '') : '';
    const localityTitle = this.locality
      ? ', ' + this.locality + (this.localityType ? ' ' + this.localityType : '')
      : '';
    const streetTitle = this.street ? ', ' + this.street + (this.streetType ? ' ' + this.streetType : '') : '';

    const streetAddress = zipCode + regionTitle + districtTitle + townTitle + localityTitle + streetTitle;

    const house = this.houseNumber ? ', дом ' + this.houseNumber : '';
    const block = this.blockNumber ? ', корп. ' + this.blockNumber : '';
    const building = this.buildingNumber ? ', стр. ' + this.buildingNumber : '';
    const flat = this.flatNumber ? ', ' + this.flatNumber : '';

    const address = streetAddress + house + block + building + flat;
    return address;
  }

  getAddressFromCity(): string {
    const townTitle = this.town ? ', ' + this.town + ' ' + this.townType : '';
    const localityTitle = this.locality ? ', ' + this.locality + ' ' + this.localityType : '';
    const streetTitle = this.street ? ', ' + this.street + ' ' + this.streetType : '';

    const streetAddress = townTitle + localityTitle + streetTitle;

    const house = this.houseNumber ? ', дом ' + this.houseNumber : '';
    const block = this.blockNumber ? ', корп. ' + this.blockNumber : '';
    const building = this.buildingNumber ? ', стр. ' + this.buildingNumber : '';
    const flat = this.flatNumber ? ', ' + this.flatNumber : '';

    const address = streetAddress + house + block + building + flat;
    return address.slice(1);
  }

  getAddressFromHouse(): string {
    const house = this.houseNumber ? ', д ' + this.houseNumber : '';
    const block = this.blockNumber ? ', корп ' + this.blockNumber : '';
    const building = this.buildingNumber ? ', стр ' + this.buildingNumber : '';
    const flat = this.flatNumber ? ', кв ' + this.flatNumber : '';

    const address = house + block + building + flat;
    return address;
  }
}
