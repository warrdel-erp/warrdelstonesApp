import React from 'react';
import { TouchableOpacity } from 'react-native';
import { getTokens, Separator, useTheme, XStack, YStack } from 'tamagui';
import { BodyText, Heading5 } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';

export interface SummaryItem {
  label: string;
  value: string | number;
  bold?: boolean;
  color?: string;
  divider?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
  onIconClick?: () => void;
}

export interface FinancialSummaryProps {
  items: SummaryItem[];
  title?: string;
  containerProps?: any;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  items,
  title,
  containerProps,
}) => {
  const tokens = getTokens();
  const theme = useTheme();

  const formatCurrency = (value: string | number): string => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <CardWithHeader
      title={title}
      variant="highlighted"
      color="blue"
      containerProps={{
        backgroundColor: theme.backgroundSecondary?.val || '#F9FAFB',
        minWidth: 300,
        ...containerProps,
      }}>
      <YStack gap={tokens.space[3].val}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.divider && (
              <Separator borderColor={theme.borderLight?.val || '#F3F4F6'} />
            )}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingTop={item.divider ? tokens.space[2].val : 0}>
              {item.bold ? (
                <Heading5 color={item.color || theme.textPrimary?.val || '#1F2937'}>
                  {item.label}
                </Heading5>
              ) : (
                <BodyText color={item.color || theme.textSecondary?.val || '#6B7280'}>
                  {item.label}
                </BodyText>
              )}
              <XStack gap={tokens.space[1].val} alignItems="center">
                {item.bold ? (
                  <Heading5 color={item.color || theme.blue8?.val || '#3B82F6'}>
                    {formatCurrency(item.value)}
                  </Heading5>
                ) : (
                  <BodyText color={item.color || theme.textPrimary?.val || '#1F2937'}>
                    {formatCurrency(item.value)}
                  </BodyText>
                )}
                {item.icon && (
                  <TouchableOpacity
                    onPress={item.onIconClick}
                    disabled={!item.onIconClick}
                    style={{
                      padding: tokens.space[1].val,
                      opacity: item.onIconClick ? 1 : 0.6,
                    }}>
                    {item.icon}
                  </TouchableOpacity>
                )}
              </XStack>
            </XStack>
          </React.Fragment>
        ))}
      </YStack>
    </CardWithHeader>
  );
};

export default FinancialSummary;
