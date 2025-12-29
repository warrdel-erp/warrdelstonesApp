import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import ButtonsDemoScreen from '../../../screens/demo/ButtonsDemoScreen.tsx';
import CardWithHeaderDemoScreen from '../../../screens/demo/CardWithHeaderDemoScreen.tsx';
import FormComponentsDemoScreen from '../../../screens/demo/FormComponentsDemoScreen.tsx';
import HeadingDemoScreen from '../../../screens/demo/HeadingDemoScreen.tsx';
import IconsDemoScreen from '../../../screens/demo/IconsDemoScreen.tsx';
import StatusBadgesDemoScreen from '../../../screens/demo/StatusBadgesDemoScreen.tsx';
import TabsDemoScreen from '../../../screens/demo/TabsDemoScreen.tsx';
import TableDemoScreen from '../../../screens/demo/TableDemoScreen.tsx';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';

const Stack = createStackNavigator();

export const DEMO_SCREENS: ScreenItem[] = [
    {
        id: ScreenId.ICONS_DEMO,
        title: 'Icons',
        component: IconsDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.BUTTONS_DEMO,
        title: 'Buttons',
        component: ButtonsDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.HEADING_DEMO,
        title: 'Heading',
        component: HeadingDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.STATUS_BADGES_DEMO,
        title: 'Status Badges',
        component: StatusBadgesDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.FORM_COMPONENTS_DEMO,
        title: 'Form Components',
        component: FormComponentsDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.CARD_WITH_HEADER_DEMO,
        title: 'CardWithHeader',
        component: CardWithHeaderDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.TABS_DEMO,
        title: 'Tabs',
        component: TabsDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
    {
        id: ScreenId.TABLE_DEMO,
        title: 'Mobile Table',
        component: TableDemoScreen,
        roles: ALL_ROLES,
        isRoot: false,
    },
];

export const DemoNavigator: React.FC = ({ route }: any) => {
    const navigation = useNavigation();
    
    // Get the route name from the drawer - this tells us which screen to show
    // The route name will be the ScreenId (e.g., 'IconsDemo', 'ButtonsDemo')
    const routeName = route?.name || route?.params?.screen;
    
    // Navigate to the correct screen if route name is provided
    useEffect(() => {
        if (routeName && DEMO_SCREENS.find(s => s.id === routeName)) {
            // Use replace to ensure we show the correct screen
            navigation.navigate(routeName as any);
        }
    }, [routeName, navigation]);
    
    // Find the matching screen or default to first
    const initialRouteName = routeName && DEMO_SCREENS.find(s => s.id === routeName)?.id 
        ? routeName 
        : DEMO_SCREENS[0]?.id;

    return (
        <Stack.Navigator 
            key={routeName || 'default'} 
            initialRouteName={initialRouteName}>
            {DEMO_SCREENS.map(screen => (
                <Stack.Screen
                    name={screen.id}
                    key={screen.title}
                    component={screen.component}
                    options={{
                        header: createHeaderComponent(
                            screen.id,
                            'Component Demos',
                            screen.title,
                            screen.isRoot,
                        ),
                    }}
                />
            ))}
        </Stack.Navigator>
    );
};

