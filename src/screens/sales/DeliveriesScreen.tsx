import React, { useCallback } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import GoogleMap from '../../components/GoogleMap.tsx';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import theme from '../../theme';
import { ApprovedTab } from './ApprovedTab.tsx';
import { CompletedTab } from './CompletedTab.tsx';
import { OnGoingTab } from './OnGoingTab.tsx';
import { RejectedTab } from './RejectedTab.tsx';
import { ScheduleTab } from './ScheduleTab.tsx';

const tabs: TabItem[] = [
    {
        id: 'SCHEDULE',
        label: 'Schedule',
    },
    {
        id: 'ON_GOING',
        label: 'On Going',
    },
    {
        id: 'APPROVED',
        label: 'Approved',
    },
    {
        id: 'COMPLETED',
        label: 'Completed',
    },
    {
        id: 'REJECTED',
        label: 'Rejected',
    },
    {
        id: 'LIVE_MAPS',
        label: 'Live Maps',
    },
];

export const DeliveriesScreen: React.FC = () => {
    const pagerViewRef = React.useRef<PagerView>(null);
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabPress = useCallback((index: number) => {
        pagerViewRef.current?.setPage(index);
    }, []);

    const handlePageSelected = useCallback((e: any) => {
        setSelectedTab(e.nativeEvent.position);
    }, []);

    return (
        <BaseScreen scrollable={false} keyboardAware={false}>
            <View>
                <Tabs
                    tabs={tabs}
                    variant={'pill-outlined'}
                    style={{ paddingVertical: theme.spacing.sm }}
                    scrollable={true}
                    autoScroll={true}
                    selectedIndex={selectedTab}
                    onTabPress={handleTabPress}
                />
            </View>
            <PagerView
                ref={pagerViewRef}
                style={{ flex: 1 }}
                onPageSelected={handlePageSelected}
                initialPage={selectedTab}
            >
                <ScheduleTab isActive={selectedTab === 0} />
                <OnGoingTab isActive={selectedTab === 1} />
                <ApprovedTab isActive={selectedTab === 2} />
                <CompletedTab isActive={selectedTab === 3} />
                <RejectedTab isActive={selectedTab === 4} />
                <GoogleMap />
            </PagerView>
        </BaseScreen>
    );
};
