import React from 'react';
import { View } from 'react-native';
import { BodyText, Card, Container, Heading, Heading5, Separator } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import theme from '../../theme';

const HeadingDemoScreen: React.FC = () => {
    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Heading Component</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.lg }}>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    All Heading Levels:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={1}>Heading Level 1</Heading>
                                    <Heading level={2}>Heading Level 2</Heading>
                                    <Heading level={3}>Heading Level 3</Heading>
                                    <Heading level={4}>Heading Level 4</Heading>
                                    <Heading level={5}>Heading Level 5</Heading>
                                    <Heading level={6}>Heading Level 6</Heading>
                                </View>
                            </View>

                            <Separator />

                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Subheadings:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={1} subheading="This is a subheading for H1">
                                        Main Heading
                                    </Heading>
                                    <Heading level={2} subheading="This is a subheading for H2">
                                        Main Heading
                                    </Heading>
                                    <Heading level={3} subheading="This is a subheading for H3">
                                        Main Heading
                                    </Heading>
                                    <Heading level={4} subheading="This is a subheading for H4">
                                        Main Heading
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Icons:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={3} icon="Home" subheading="Home icon with subheading">
                                        Home Section
                                    </Heading>
                                    <Heading level={4} icon="User" subheading="User icon with subheading">
                                        User Profile
                                    </Heading>
                                    <Heading level={4} icon="Settings" iconColor={theme.colors.primary}>
                                        Settings
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Text Alignments:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={4} alignment="left" subheading="Left aligned text">
                                        Left Aligned
                                    </Heading>
                                    <Heading level={4} alignment="center" subheading="Center aligned text">
                                        Center Aligned
                                    </Heading>
                                    <Heading level={4} alignment="right" subheading="Right aligned text">
                                        Right Aligned
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Separator:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading
                                        level={3}
                                        subheading="This heading has a separator below"
                                        showSeparator={true}>
                                        Section Title
                                    </Heading>
                                    <Heading
                                        level={4}
                                        subheading="Custom separator color"
                                        showSeparator={true}
                                        separatorColor={theme.colors.primary}>
                                        Another Section
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Custom Colors:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading
                                        level={4}
                                        color={theme.colors.primary}
                                        subheading="Primary color heading"
                                        subheadingColor={theme.colors.text.secondary}>
                                        Primary Color
                                    </Heading>
                                    <Heading
                                        level={4}
                                        color={theme.colors.status.success}
                                        subheading="Success color heading">
                                        Success Color
                                    </Heading>
                                    <Heading
                                        level={4}
                                        icon="Star"
                                        iconColor={theme.colors.status.warning}
                                        color={theme.colors.status.warning}
                                        subheading="Warning color with icon">
                                        Warning Color
                                    </Heading>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </Container>
        </BaseScreen>
    );
};

export default HeadingDemoScreen;

