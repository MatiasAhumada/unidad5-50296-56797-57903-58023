import Card from '../../core/components/organisms/Card';

function ProductList({ products }) {
  if (products.length === 0) {
    return <Card>No se encontraron productos.</Card>;
  }

  return products.map((product) => (
    <Card key={product.sku}>
      <h2>
        {product.sku} - {product.name}
      </h2>
      <p className="text-base">
        Stock: {product.stockQuantity} - ${product.currentUnitPrice} -{' '}
        {product.isActive ? 'Activado' : 'Desactivado'}
      </p>
    </Card>
  ));
}

export default ProductList;
