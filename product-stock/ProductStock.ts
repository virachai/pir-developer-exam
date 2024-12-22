interface Product {
  id: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  category: "A" | "B" | "C";
}

class InventoryManager {
  private products: Product[] = [];
  private discountRules: Record<string, number> = {
    A: 0.05,
    B: 0.03,
    C: 0.01,
  };
  private taxRate: number = 0.08;

  constructor(initialProducts: Product[]) {
    this.products = initialProducts;
  }

  public addProduct(product: Product): void {
    // ตรวจสอบสินค้าซ้ำ
    if (this.products.some((p) => p.id === product.id)) {
      console.log(`Product with id ${product.id} already exists.`);
      return;
    }
    this.products.push(product);
  }

  public updateStock(productId: string, newQuantity: number): void {
    // ตรวจสอบว่า newQuantity เป็นจำนวนเต็มบวกหรือไม่
    if (newQuantity <= 0 || !Number.isInteger(newQuantity)) {
      console.log("Invalid stock quantity.");
      return;
    }
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex].stockQuantity = newQuantity;
    }
  }

  public calculateRevenue(soldQuantity: number, productId: string): number {
    const product = this.getProductById(productId);
    if (!product) return 0;

    // ตรวจสอบว่า soldQuantity ไม่เกิน stockQuantity
    if (soldQuantity > product.stockQuantity) {
      console.log("Sold quantity exceeds available stock.");
      return 0;
    }

    const discountedPrice =
      product.sellingPrice * (1 - this.getDiscount(product.category));
    const taxAmount = discountedPrice * soldQuantity * this.taxRate;
    const revenue = discountedPrice * soldQuantity + taxAmount;

    return revenue;
  }

  public calculateProfit(soldQuantity: number, productId: string): number {
    const product = this.getProductById(productId);
    if (!product) return 0;

    const discountedPrice =
      product.sellingPrice * (1 - this.getDiscount(product.category));
    const cost = product.costPrice * soldQuantity;
    const profit = discountedPrice * soldQuantity - cost;

    // คำนวณภาษีในการคำนวณกำไร
    const taxAmount = discountedPrice * soldQuantity * this.taxRate;
    return profit - taxAmount;
  }

  private getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  private getDiscount(category: string): number {
    return this.discountRules[category] || 0;
  }

  public restock(productId: string, additionalQuantity: number): void {
    // ตรวจสอบว่า additionalQuantity เป็นจำนวนเต็มบวกหรือไม่
    if (additionalQuantity <= 0 || !Number.isInteger(additionalQuantity)) {
      console.log("Invalid restock quantity.");
      return;
    }
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex].stockQuantity += additionalQuantity;
    }
  }

  public getLowStockProducts(threshold: number): Product[] {
    return this.products.filter((p) => p.stockQuantity <= threshold);
  }
}

// Usage example
const inventory = new InventoryManager([
  {
    id: "P001",
    name: "Laptop",
    costPrice: 800,
    sellingPrice: 1200,
    stockQuantity: 50,
    category: "A",
  },
  {
    id: "P002",
    name: "Smartphone",
    costPrice: 300,
    sellingPrice: 600,
    stockQuantity: 100,
    category: "B",
  },
]);

inventory.addProduct({
  id: "P003",
  name: "Tablet",
  costPrice: 250,
  sellingPrice: 400,
  stockQuantity: 75,
  category: "C",
});

console.log(inventory.calculateRevenue(5, "P001"));
console.log(inventory.calculateProfit(5, "P001"));

inventory.updateStock("P001", 40);
console.log(inventory.getLowStockProducts(50));

inventory.restock("P002", 20);
console.log(inventory.getLowStockProducts(50));

// Example of adding an invalid product
inventory.addProduct({
  id: "P003",
  name: "Tablet",
  costPrice: 250,
  sellingPrice: -400, // Invalid selling price
  stockQuantity: 75,
  category: "C",
});

// Example of invalid stock quantity update
inventory.updateStock("P001", -10); // Invalid quantity

// Example of calculating revenue with invalid sold quantity
console.log(inventory.calculateRevenue(200, "P001")); // Exceeds available stock

// Example of calculating profit with non-existent product
console.log(inventory.calculateProfit(5, "P999")); // Product not found

// Example of invalid restocking
inventory.restock("P003", -20); // Invalid quantity

// Example of checking low stock with invalid threshold
console.log(inventory.getLowStockProducts(-10)); // Invalid threshold
