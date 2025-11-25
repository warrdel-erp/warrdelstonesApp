import { StackScreenProps } from '@react-navigation/stack';

// Define a generic param list that can accept any screen with any params
export type GenericParamList = Record<string, any>;

// Generic screen props that work with React Navigation
export type GenericStackScreenProps<
  ParamList extends GenericParamList = GenericParamList,
  RouteName extends keyof ParamList = keyof ParamList,
> = StackScreenProps<ParamList, RouteName>;

export type ScreenProps<RouteParams = undefined> = {
  navigation: any; // Navigation object with all methods
  route: {
    params: RouteParams;
    name: string;
    key: string;
  };
};
