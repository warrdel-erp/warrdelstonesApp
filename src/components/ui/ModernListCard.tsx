import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BodyText, Caption } from './Typography';
import appTheme from '../../theme';

export interface MetricItem {
  label: string;
  value: string | number;
  color?: string;
}

export interface ModernListCardProps {
  title: string | React.ReactNode;
  statusBadge?: React.ReactNode;
  subtitle?: string | React.ReactNode;
  tags?: (string | React.ReactNode | null | undefined)[];
  metrics?: MetricItem[];
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ModernListCard: React.FC<ModernListCardProps> = ({
  title,
  statusBadge,
  subtitle,
  tags,
  metrics,
  footerLeft,
  footerRight,
  onPress,
  style,
}) => {
  const cardContent = (
    <View style={styles.cardHeaderArea}>
      <View style={styles.mainRow}>
        <View style={styles.detailsContainer}>
          {/* Row 1: Title & Status */}
          <View style={styles.cardTitleRow}>
            {typeof title === 'string' ? (
              <BodyText style={styles.productName} numberOfLines={1}>
                {title}
              </BodyText>
            ) : (
              title
            )}
            {statusBadge && <View style={styles.statusBadgeWrap}>{statusBadge}</View>}
          </View>

          {/* Row 2: Subtitle */}
          {subtitle && (
            <View style={styles.cardInfoRow}>
              {typeof subtitle === 'string' ? (
                <BodyText style={styles.subText} numberOfLines={1}>
                  {subtitle}
                </BodyText>
              ) : (
                subtitle
              )}
            </View>
          )}

          {/* Row 3: Tags */}
          {tags && tags.filter(Boolean).length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map((tag, idx) => {
                if (!tag) return null;
                if (typeof tag === 'string') {
                  const colorMap = [
                    { bg: '#EEF2FF', text: '#4F46E5' }, // Indigo
                    { bg: '#F0FDF4', text: '#16A34A' }, // Green
                    { bg: '#FFF7ED', text: '#EA580C' }, // Orange
                    { bg: '#FDF2F8', text: '#DB2777' }, // Pink
                  ];
                  const scheme = colorMap[idx % colorMap.length];
                  return (
                    <View key={idx} style={[styles.pillTag, { backgroundColor: scheme.bg }]}>
                      <BodyText style={[styles.pillTagText, { color: scheme.text }]}>
                        {tag}
                      </BodyText>
                    </View>
                  );
                }
                return <React.Fragment key={idx}>{tag}</React.Fragment>;
              })}
            </View>
          )}

          {/* Metrics Row */}
          {metrics && metrics.length > 0 && (
            <View style={styles.metricsRow}>
              {metrics.map((metric, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <View style={styles.metricDivider} />}
                  <View style={styles.metricItem}>
                    <Caption style={styles.metricLabel}>{metric.label}</Caption>
                    <BodyText
                      style={[styles.metricValue, metric.color ? { color: metric.color } : null]}>
                      {metric.value}
                    </BodyText>
                  </View>
                </React.Fragment>
              ))}
            </View>
          )}

          {/* Footer Row */}
          {(footerLeft || footerRight) && (
            <View style={styles.bottomRow}>
              <View style={styles.locationWrap}>{footerLeft}</View>
              {footerRight && <View style={styles.actionRow}>{footerRight}</View>}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.cardContainer, style]}>
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {cardContent}
        </TouchableOpacity>
      ) : (
        cardContent
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'visible',
    marginVertical: 4,
  },
  cardHeaderArea: {
    padding: 0,
  },
  mainRow: {
    flexDirection: 'row',
  },
  detailsContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontFamily: appTheme.typography.fontFamily.bold,
    color: '#0F172A',
    fontSize: 16,
  },
  statusBadgeWrap: {
    marginLeft: 8,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: appTheme.typography.fontFamily.medium,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  pillTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTagText: {
    fontSize: 11,
    color: '#475569',
    fontFamily: appTheme.typography.fontFamily.bold,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricItem: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  metricLabel: {
    fontSize: 10,
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: appTheme.typography.fontFamily.bold,
  },
  metricValue: {
    fontSize: 13,
    color: '#0F172A',
    fontFamily: appTheme.typography.fontFamily.bold,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ModernListCard;
