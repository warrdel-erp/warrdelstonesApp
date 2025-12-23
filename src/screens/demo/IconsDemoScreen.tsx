import React from 'react';
import { View } from 'react-native';
import { Caption, Card, Container, Heading5, Icon, Separator } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import theme from '../../theme';

const IconsDemoScreen: React.FC = () => {
    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Icons (Lucide from Tamagui)</Heading5>
                    <Card>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Home" size={32} color={theme.colors.primaryDark} />
                                <Caption>Home</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="User" size={32} color={theme.colors.primaryDark} />
                                <Caption>User</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Settings" size={32} color={theme.colors.primaryDark} />
                                <Caption>Settings</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Search" size={32} color={theme.colors.primaryDark} />
                                <Caption>Search</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Heart" size={32} color={theme.colors.primaryDark} />
                                <Caption>Heart</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Bell" size={32} color={theme.colors.primaryDark} />
                                <Caption>Bell</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Mail" size={32} color={theme.colors.primaryDark} />
                                <Caption>Mail</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Star" size={32} color={theme.colors.primaryDark} />
                                <Caption>Star</Caption>
                            </View>
                        </View>
                        <View style={{ marginVertical: theme.spacing.md }}>
                            <Separator />
                        </View>
                        <View>
                            <Caption style={{ marginBottom: theme.spacing.sm }}>
                                Different Icon Families:
                            </Caption>
                            <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                <Icon name="home" family="MaterialIcons" size={24} color={theme.colors.primaryDark} />
                                <Icon name="heart" family="FontAwesome" size={24} color={theme.colors.primaryDark} />
                                <Icon name="ios-home" family="Ionicons" size={24} color={theme.colors.primaryDark} />
                                <Icon name="home" family="Feather" size={24} color={theme.colors.primaryDark} />
                            </View>
                        </View>
                    </Card>
                </View>
            </Container>
        </BaseScreen>
    );
};

export default IconsDemoScreen;

