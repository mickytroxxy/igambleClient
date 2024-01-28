import { KeyboardTypeOptions, StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"

export type Shop = {
    id:number,
    title:string,
    price:number,
    description:string,
    image:string,
    rating:string,
    category:string,
    quantity?:number
}
export type Categories = {
    category:string,
    selected:boolean
}
export type IconType = {
    size?:number,
    color:string,
    type:string,
    name:string,
    min?:number
}
export interface TextAreaProps {
    attr: {
      icon: IconType;
      placeholder: string;
      keyboardType?: KeyboardTypeOptions;
      field: string;
      value?: string;
      color?:string;
      height?:any;
      multiline?:boolean;
      handleChange: (field: string, value: string) => any;
    };
}
export interface ButtonProps extends TouchableOpacityProps {
    btnInfo?: {
      styles?: StyleProp<ViewStyle>;
    };
    textInfo?: {
      text?: string;
      color?: string;
    };
    iconInfo: IconType;
    handleBtnClick: () => void;
    disabled?:boolean
}
export interface IconButtonProps {
  iconInfo: IconType;
  handleBtnClick: () => void;
}
export interface AddressButtonProps {
  handleBtnClick: (value:LocationType) => void;
  placeholder?:string;
}
export type LocationType = {
  latitude:number;
  longitude:number;
  text?:string;
  short_name?:string;
  long_name?:string
}
export type CountryDataType = {
  dialCode:string;
  name:string;
  flag:string;
}
export type ConfirmDialogType = {
  isVisible: boolean,
  text: string,
  okayBtn: string,
  cancelBtn: string,
  hasHideModal:boolean,
  isSuccess?: boolean,
  response?:any,
  severity?:boolean
}
export type UserProfile = {
  fname?: string;
  owingDate?:any;
  blocked?:string[];
  reports?:any[];
  deleted?:boolean;
  avatar?: string;
  clientId?: string;
  code?:number,
  notificationToken?:string,
  accountOwner?: string;
  phoneNumber?: string;
  services?: {
    type: string;
    fees: {
      type: string;
      fee: number | string;
      name: string;
    }[];
  }[];
  birthDay?: string;
  selfiePhoto?:string;
  idPhoto?:string;
  privacy?:any;
  gender?: string;
  geoHash?:string;
  address?: {
    text?: string;
    latitude?: number;
    longitude?: number;
  };
  about?: string;
  isVerified?: boolean;
  photos?: {
    photoId: number;
    url: string;
  }[];
  balance?:number;
  transactions?:any;
  history?:[];
  rates?:[];
  type?:string;
};
export type LocationInputProps = {
  handleChange: (field: string, value: object) => void;
  field: string;
  placeHolder: string;
};
export type FeesType = {
  name:string;
  type:string;
  fee:number | string
}
export type BusinessServicesType = {
  type:string;
  selected?:boolean;
  fees?:FeesType[]
}
export interface WithDrawalType {
  amount: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string; // Assuming accountType can have any string value
}
export type PrivacyType = {
  type:string;
  selected:boolean;
}
export type RequestType = {
  connectionId: string;
  date: {
    nanoseconds: number;
    seconds: number;
  };
  dateSent: number;
  durationType: string;
  fromToArray: [string, string];
  fromUser: any[];
  meetUpLocation: LocationType;
  message: string;
  offer: string;
  paymentMethod: string;
  quantity: string;
  service: string;
  status: string;
  time: {
    nanoseconds: number;
    seconds: number;
  };
  toUser: string;
  unitPrice: number;
};
export type GamblingItemsType = {
  id: number;
  class: string;
  duration?: number;
  totalCost?: number;
  selected?: boolean;
  items?: string[];
  minBet:number;
  description?: string;
  status?:number;
  transactionId?:any
};
export type CameraResponseType = {
  selfieResponse: (value:string) => void;
  test?: number;
};