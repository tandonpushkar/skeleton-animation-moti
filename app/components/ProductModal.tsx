import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const PRODUCT_DATA = [
  { id: '1', name: 'Slim Fit Shirt', brand: 'Roadster', price: '₹799', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80' },
  { id: '2', name: 'Printed T-Shirt', brand: 'HRX', price: '₹499', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80' },
  { id: '3', name: 'Skinny Jeans', brand: 'Levis', price: '₹1999', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80' },
  { id: '4', name: 'Running Shoes', brand: 'Nike', price: '₹3995', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { id: '5', name: 'Casual Watch', brand: 'Fossil', price: '₹8995', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80' },
];

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductSelect: () => void;
  searchText: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ visible, onClose, onProductSelect, searchText }) => {
  const filteredProducts = useMemo(() => {
    if (!searchText) return PRODUCT_DATA;
    const lowerSearchText = searchText.toLowerCase();
    return PRODUCT_DATA.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const brand = product.brand?.toLowerCase() || '';
      return name.includes(lowerSearchText) || brand.includes(lowerSearchText);
    });
  }, [searchText]);

  if (!visible) return null;

  const handleProductPress = (product: any) => {
    console.log('Selected product:', product);
    onProductSelect(); 
  };

  return (
    <View style={styles.modalContainer}>
      <FlatList
        keyboardShouldPersistTaps='handled'
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productItem} 
            onPress={() => handleProductPress(item)}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage} 
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productBrand}>{item.brand}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noResults}>No products found</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 70, 
    left: 10,
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  productInfo: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#282c3f',
  },
  productBrand: {
    fontSize: 14,
    color: '#94969f',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#282c3f',
  },
  noResults: {
    padding: 20,
    textAlign: 'center',
    color: '#94969f',
  },
});

export default ProductModal;