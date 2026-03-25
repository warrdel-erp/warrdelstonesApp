import React from 'react';
import { useTheme } from 'tamagui';
import { SelectedInventoryProduct } from './AddProductsToSO';
import ProductsTable, { InventoryItem, ProductRow } from './ProductsTable';
import FinancialSummary from './FinancialSummary';

interface SelectedProductsSummaryProps {
    selectedProducts: SelectedInventoryProduct[];
    onDeleteProduct: (productId: number, serialNo?: string) => void;
    onToggleTax: (productId: number, checked: boolean) => void;
}

const SelectedProductsSummary: React.FC<SelectedProductsSummaryProps> = ({
    selectedProducts,
    onDeleteProduct,
    onToggleTax,
}) => {
    const theme = useTheme();

    // Transform selected products for display
    const productsRows: ProductRow[] = React.useMemo(() => {
        // Group by product ID
        const grouped: Record<number, { name: string; items: SelectedInventoryProduct[] }> = {};

        selectedProducts.forEach(sp => {
            const productId = sp.details?.productId || 0;
            if (!grouped[productId]) {
                grouped[productId] = {
                    name: sp.details?.product?.name || 'Unknown Product',
                    items: [],
                };
            }
            grouped[productId].items.push(sp);
        });

        return Object.entries(grouped).map(([productId, data]) => {
            const firstItem = data.items[0];
            const totalQty = data.items.reduce((sum, item) => {
                const slab = item.details?.slab;
                if (slab) {
                    return sum + (slab.receivingLength * slab.receivingWidth / 144);
                }
                return sum;
            }, 0);

            const unitPrice = parseFloat(firstItem.unitPrice || '0');

            const inventoryItems: InventoryItem[] = data.items.map(item => {
                const slab = item.details?.slab;
                return {
                    serialNo: item.details?.combinedNumber || '',
                    barcode: slab?.barcode || '',
                    blockBundle: slab ? `${slab.block}-${slab.lot}` : '',
                    slabNo: slab?.slabNumber?.toString() || '',
                    location: item.details?.bin?.name || '',
                    qtySf: slab ? `${slab.receivingLength}*${slab.receivingWidth}=${(slab.receivingLength * slab.receivingWidth / 144).toFixed(2)}SF` : '',
                    subTrx: '-',
                    productId: Number(productId),
                };
            });

            return {
                id: Number(productId),
                productName: data.name,
                units: 'SF',
                qty: totalQty,
                pricePerUnit: unitPrice,
                total: totalQty * unitPrice,
                tax: firstItem.taxApplied,
                inventoryItems,
            };
        });
    }, [selectedProducts]);

    // Calculate totals for Financial Summary
    const subTotal = productsRows.reduce((sum, p) => sum + p.total, 0);
    const taxableTotal = productsRows.filter(p => p.tax).reduce((sum, p) => sum + p.total, 0);
    const taxValue = 0; // Default tax value
    const taxAmount = (taxableTotal * taxValue) / 100;
    const finalTotal = subTotal + taxAmount;

    const financialSummaryItems = [
        { label: 'Sub-Total', value: subTotal },
        { label: 'Taxable', value: taxableTotal },
        { label: `Tax(${taxValue}%)`, value: taxAmount },
        { label: 'Total', value: finalTotal, bold: true, color: theme.blue8?.val || '#3B82F6', divider: true },
    ];

    if (selectedProducts.length === 0) return null;

    return (
        <>
            <ProductsTable
                products={productsRows}
                onDeleteItem={onDeleteProduct}
                onToggleTax={onToggleTax}
            />
            <FinancialSummary
                title="Financial Summary"
                items={financialSummaryItems}
            />
        </>
    );
};

export default SelectedProductsSummary;
