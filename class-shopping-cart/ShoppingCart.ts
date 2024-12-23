interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

class ShoppingCart {
  private items: CartItem[] = [];
  private taxRate: number = 0.07;

  public addItem(item: CartItem): void {
    const existingItemIndex = this.items.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      this.items[existingItemIndex].quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  public calculateSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  public calculateTax(subtotal: number): number {
    return subtotal * this.taxRate;
  }

  public calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    return Math.round((subtotal + tax) * 100) / 100;
  }

  public getCartSummary(): string {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal();
    return `Subtotal: $${subtotal.toFixed(2)}, Tax: $${tax.toFixed(
      2
    )}, Total: $${total.toFixed(2)}`;
  }

  public applyDiscount(discountPercentage: number = 0): void {
    if (discountPercentage <= 0 || discountPercentage > 100) return;
    this.items.forEach((item) => {
      item.price *= 1 - discountPercentage / 100;
    });
  }
}

const cart = new ShoppingCart();

cart.addItem({ id: "1", name: "Laptop", price: 999.99, quantity: 1 });
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99, quantity: 2 });

console.log("Cart Summary (Before Discount):", cart.getCartSummary());

cart.applyDiscount(10);

console.log("Cart Summary (After Discount):", cart.getCartSummary());

cart.removeItem("2");

console.log("Cart Summary (After Removing T-Shirt):", cart.getCartSummary());

cart.addItem({ id: "2", name: "T-Shirt", price: 19.99, quantity: 2 });
console.log("Cart Summary (After Adding T-Shirt Back):", cart.getCartSummary());

const subtotal = cart.calculateSubtotal();
console.log("Subtotal:", subtotal.toFixed(2));

const tax = cart.calculateTax(subtotal);
console.log("Tax:", tax.toFixed(2));

const total = cart.calculateTotal();
console.log("Total:", total.toFixed(2));
