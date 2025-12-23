import React, { useState } from 'react';
import { View } from 'react-native';
import { BodyText, Card, Container, Heading5, Tabs } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import { TabItem } from '../../components/ui/Tabs';
import theme from '../../theme';

const TabsDemoScreen: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs: TabItem[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
    ];

    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Tabs</Heading5>
                    <Card>
                        <Tabs
                            tabs={tabs}
                            selectedIndex={selectedTab}
                            onTabPress={setSelectedTab}
                            variant="pill-outlined"
                        />
                        <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.md }}>
                            <BodyText>Selected Tab: {tabs[selectedTab]?.label}</BodyText>
                        </View>
                    </Card>
                </View>
            </Container>
        </BaseScreen>
    );
};

export default TabsDemoScreen;

