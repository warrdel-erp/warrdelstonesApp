import React from 'react';
import { View } from 'react-native';
import { Button, Card, Container, Heading5, Icon, IconButton } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import theme from '../../theme';

const ButtonsDemoScreen: React.FC = () => {
    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Buttons</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.md }}>
                            <Button title="Primary Button" variant="primary" onPress={() => { }} />
                            <Button title="Secondary Button" variant="secondary" onPress={() => { }} />
                            <Button title="Outlined Button" variant="outline" onPress={() => { }} />
                            <Button title="Text Button" variant="text" onPress={() => { }} />
                            <Button title="Disabled Button" variant="primary" disabled onPress={() => { }} />
                            <Button
                                title="Button with Icon"
                                variant="primary"
                                icon={<Icon name="Plus" size={20} color={theme.colors.white} />}
                                onPress={() => { }}
                            />
                        </View>
                    </Card>
                </View>

                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Icon Buttons</Heading5>
                    <Card>
                        <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                            <IconButton iconName="home" variant="primary" size="small" onPress={() => { }} />
                            <IconButton iconName="person" variant="secondary" size="medium" onPress={() => { }} />
                            <IconButton iconName="settings" variant="outlined" size="large" onPress={() => { }} />
                            <IconButton iconName="favorite" variant="plain" size="extraSmall" onPress={() => { }} />
                        </View>
                    </Card>
                </View>
            </Container>
        </BaseScreen>
    );
};

export default ButtonsDemoScreen;

