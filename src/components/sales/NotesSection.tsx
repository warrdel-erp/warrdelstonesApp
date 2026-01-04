import React from 'react';
import { getTokens, useTheme, YStack } from 'tamagui';
import CardWithHeader from '../ui/CardWithHeader';
import { BodyText, Heading5 } from '../ui';

export interface NotesSectionProps {
  printedNotes?: string;
  internalNotes?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  printedNotes,
  internalNotes,
}) => {
  const tokens = getTokens();
  const theme = useTheme();

  return (
    <CardWithHeader title="Notes" containerProps={{ minWidth: 300 }}>
      <YStack gap={tokens.space[4].val}>
        <YStack gap={tokens.space[2].val}>
          <Heading5>Printed Notes</Heading5>
          <YStack
            backgroundColor={theme.background?.val || '#FFFFFF'}
            padding={tokens.space[4].val}
            borderRadius={tokens.radius[3].val}
            borderWidth={1}
            borderColor={theme.borderLight?.val || '#F3F4F6'}>
            <BodyText color={theme.textPrimary?.val || '#1F2937'}>
              {printedNotes || 'No notes'}
            </BodyText>
          </YStack>
        </YStack>

        <YStack gap={tokens.space[2].val}>
          <Heading5>Internal Notes</Heading5>
          <YStack
            backgroundColor={theme.yellow2?.val || '#FEFCE8'}
            padding={tokens.space[4].val}
            borderRadius={tokens.radius[3].val}
            borderWidth={1}
            borderColor={theme.yellow6?.val || '#EAB308'}>
            <BodyText color={theme.textPrimary?.val || '#1F2937'}>
              {internalNotes || 'No notes'}
            </BodyText>
          </YStack>
        </YStack>
      </YStack>
    </CardWithHeader>
  );
};

export default NotesSection;

