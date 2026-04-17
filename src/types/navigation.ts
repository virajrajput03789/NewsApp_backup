import { NavigatorScreenParams } from '@react-navigation/native';
import { Article } from './article';

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { article: Article };
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookmarksTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
};