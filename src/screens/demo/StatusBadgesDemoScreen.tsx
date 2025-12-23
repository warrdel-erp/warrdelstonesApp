import React from 'react';
import { View } from 'react-native';
import { BodyText, Card, Container, Heading5, StatusBadge } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import theme from '../../theme';

const StatusBadgesDemoScreen: React.FC = () => {
    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Status Badges</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.md }}>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Solid Variant (Default):
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" />
                                    <StatusBadge status="error" text="Error" />
                                    <StatusBadge status="warning" text="Warning" />
                                    <StatusBadge status="info" text="Info" />
                                    <StatusBadge status="primary" text="Primary" />
                                    <StatusBadge status="secondary" text="Secondary" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Soft Variant:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" variant="soft" />
                                    <StatusBadge status="error" text="Error" variant="soft" />
                                    <StatusBadge status="warning" text="Warning" variant="soft" />
                                    <StatusBadge status="info" text="Info" variant="soft" />
                                    <StatusBadge status="purple" text="Purple" variant="soft" />
                                    <StatusBadge status="orange" text="Orange" variant="soft" />
                                    <StatusBadge status="teal" text="Teal" variant="soft" />
                                    <StatusBadge status="pink" text="Pink" variant="soft" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Outlined Variant:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" variant="outlined" />
                                    <StatusBadge status="error" text="Error" variant="outlined" />
                                    <StatusBadge status="warning" text="Warning" variant="outlined" />
                                    <StatusBadge status="info" text="Info" variant="outlined" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Icons:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" icon="CheckCircle" variant="soft" />
                                    <StatusBadge status="error" text="Error" icon="XCircle" variant="soft" />
                                    <StatusBadge status="warning" text="Warning" icon="AlertTriangle" variant="soft" />
                                    <StatusBadge status="info" text="Info" icon="Info" variant="soft" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Sizes:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <StatusBadge status="success" text="Extra Small" size="extraSmall" variant="soft" />
                                    <StatusBadge status="success" text="Small" size="small" variant="soft" />
                                    <StatusBadge status="success" text="Medium" size="medium" variant="soft" />
                                    <StatusBadge status="success" text="Large" size="large" variant="soft" />
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </Container>
        </BaseScreen>
    );
};

export default StatusBadgesDemoScreen;

