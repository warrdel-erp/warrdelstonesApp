import { ShoppingCart } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { services } from '../../network';
import { InventoryProduct, InventoryProductStatus } from '../../types/InventoryTypes';
import { showErrorToast, showSuccessToast } from '../../utils';
import { Button } from '../ui/Button';

interface InventoryCartActionProps {
  product: InventoryProduct;
  onSuccess?: () => void;
}

export const InventoryCartAction: React.FC<InventoryCartActionProps> = ({ product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [localCartItem, setLocalCartItem] = useState(product.cartItem);
  const isInCart = !!localCartItem;
  const isAvailable = product.status === InventoryProductStatus.InInventory;

  // Sync state if product changes
  React.useEffect(() => {
    setLocalCartItem(product.cartItem);
  }, [product.cartItem]);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await services.cart.addToCart(product.id);
      if (response.success) {
        showSuccessToast('Added to cart');
        // Update local state immediately with returned cart item id (if available)
        // or just the product.id if we're just toggling view - but id is needed for delete
        setLocalCartItem(response.data?.data as any || { id: 0 });
        onSuccess?.();
      } else {
        showErrorToast(response.error?.message[0] || 'Failed to add to cart');
      }
    } catch (error: any) {
      showErrorToast(error?.message || 'Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    console.log("first", localCartItem)
    if (!localCartItem?.id) {
      showErrorToast('Cart item ID not found');
      return;
    };

    try {
      setLoading(true);
      const response = await services.cart.removeFromCart(localCartItem.id);
      if (response.success) {
        showSuccessToast('Removed from cart');
        setLocalCartItem(undefined);
        onSuccess?.();
      } else {
        showErrorToast(response.error?.message[0] || 'Failed to remove from cart');
      }
    } catch (error: any) {
      showErrorToast(error?.message || 'Error removing from cart');
    } finally {
      setLoading(false);
    }
  };

  if (isInCart) {
    return (
      <Button
        title=""
        variant="outline"
        icon={<ShoppingCart size={16} color="#EF4444" />}
        onPress={handleRemoveFromCart}
        loading={loading}
        size="small"
        style={{ borderColor: '#EF4444' }}
        color="#EF4444"
      />
    );
  }

  return (
    <Button
      title=""
      variant="primary"
      icon={<ShoppingCart size={16} color="white" />}
      onPress={handleAddToCart}
      disabled={!isAvailable}
      loading={loading}
      size="small"
    />
  );
};

export default InventoryCartAction;
