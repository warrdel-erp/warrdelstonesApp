import React, { useEffect } from 'react';
import { AppModal, Heading6 } from './ui';
import { useAppDispatch, useAppState } from '../store/hooks.ts';
import theme from '../theme';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Location } from '../types/CommonTypes.ts';
import { setSelectedLocation } from '../store/slices/appSlice.ts';

interface AppContextSelectorProps {
  visible?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}
export const AppContextSelector: React.FC<AppContextSelectorProps> = props => {
  const dispatch = useAppDispatch();
  const { selectedLocation, allLocations } = useAppState();
  const [newSelectedLocation, setNewSelectedLocation] = React.useState(selectedLocation);

  useEffect(() => {
    setNewSelectedLocation(selectedLocation);
  }, [selectedLocation, props.visible]);

  const handleSubmit = (location: Location) => {
    if (location) {
      dispatch(setSelectedLocation(location));
    }
    handleClose();
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const renderItem = (item: Location) => {
    const selected = newSelectedLocation?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.dropdownItem, selected && styles.dropdownItemSelected]}
        onPress={() => handleSubmit(item)}>
        <Heading6 style={[styles.dropdownItemText, selected && styles.dropdownItemTextSelected]}>
          {item.location}
        </Heading6>
      </TouchableOpacity>
    );
  };

  return (
    <AppModal
      visible={props.visible ?? false}
      title={'Change Location'}
      useBottomSheet={true}
      contentStyle={{ padding: 0 }}
      bottomSheetHeight={400}
      onClose={handleClose}>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.md, padding: theme.spacing.md }}>
        {/*<Dropdown*/}
        {/*  options={DATE_FILTERS}*/}
        {/*  value={selectedDateRange}*/}
        {/*  onSelectionChange={id => {*/}
        {/*    dispatch(setDashboardFilter(DATE_FILTERS.find(item => item.id === id)));*/}
        {/*    setSelectedDateRange(id as number);*/}
        {/*  }}*/}
        {/*/>*/}
        {allLocations.map(item => {
          return <View key={item.id.toString()}>{renderItem(item)}</View>;
        })}
      </ScrollView>
      {/*<Button title={'Change'} variant={'primary'} onPress={handleSubmit}*/}
      {/*        style={{marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.md}} />*/}
    </AppModal>
  );
};

const styles = StyleSheet.create({
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.primaryDark,
    borderWidth: 1,
    minHeight: 44,
  },
  dropdownItemDisabled: {
    opacity: 0.5,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  dropdownItemTextDisabled: {
    color: theme.colors.text.disabled,
  },
  dropdownItemTextSelected: {
    color: theme.colors.text.onPrimary,
  },
});
