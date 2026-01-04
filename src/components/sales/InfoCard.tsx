import { Building2, Mail, MapPin, Phone, User } from '@tamagui/lucide-icons';
import React from 'react';
import { getTokens, useTheme, XStack, YStack } from 'tamagui';
import { BodyText } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';
import { DetailItem } from '../ui/DetailItem';

export interface ContactInfo {
    name?: string;
    phone?: string;
    email?: string;
}

export interface InfoCardProps {
    title: string;
    icon?: React.ReactNode;
    address?: string;
    contact?: ContactInfo;
    iconColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    icon,
    address,
    contact,
    iconColor,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const defaultIcon = icon || <Building2 size={20} color={iconColor || theme.blue8?.val || '#3B82F6'} />;

    return (
        <CardWithHeader
            title={title}
            containerProps={{ flex: 1, minWidth: 200 }}
            style={{ marginHorizontal: tokens.space[1].val }}>
            <YStack gap={tokens.space[4].val}>
                {address && (
                    <XStack gap={tokens.space[2].val} alignItems="flex-start">
                        <MapPin size={18} color={theme.textSecondary?.val || '#6B7280'} />
                        <YStack flex={1}>
                            <BodyText color={theme.textPrimary?.val || '#1F2937'}>
                                {address}
                            </BodyText>
                        </YStack>
                    </XStack>
                )}

                {contact && (
                    <YStack gap={tokens.space[2].val}>
                        {contact.name && (
                            <DetailItem
                                label="Name"
                                value={contact.name}
                                icon={<User size={16} color={theme.textSecondary?.val || '#6B7280'} />}
                            />
                        )}
                        {contact.phone && (
                            <DetailItem
                                label="Phone"
                                value={contact.phone}
                                icon={<Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />}
                            />
                        )}
                        {contact.email && (
                            <DetailItem
                                label="Email"
                                value={contact.email}
                                icon={<Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />}
                            />
                        )}
                    </YStack>
                )}
            </YStack>
        </CardWithHeader>
    );
};

export default InfoCard;

