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

  // ฟังก์ชันนี้รับพารามิเตอร์เป็น CartItem ซึ่งรวม 'quantity' แล้ว
  // ปัญหาของเวอร์ชันก่อนหน้า: ในเวอร์ชันเดิมรับเพียง Product ซึ่งไม่รวม 'quantity'
  // ทำให้การคำนวณ quantity ไม่ได้รวมอยู่ในพารามิเตอร์
  // ฟังก์ชันนี้ใช้ได้ดีเมื่อรับ CartItem (ซึ่งรวม 'quantity' แล้ว)
  public addItem(item: CartItem): void {
    const existingItemIndex = this.items.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      // เพิ่ม quantity ของสินค้าที่มีอยู่แล้ว
      this.items[existingItemIndex].quantity += item.quantity;
    } else {
      // ถ้าเป็นสินค้าชิ้นใหม่ ก็นำข้อมูลสินค้าและ quantity เพิ่มเข้าไป
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

  // Bug: การใช้ `parseFloat((subtotal + tax).toFixed(2))` อาจทำให้เกิดปัญหาการปัดเศษที่ไม่คาดหวัง
  // เช่น การปัดเศษไม่ถูกต้องหากผลลัพธ์ของยอดรวมมีค่าใกล้เคียงกับจุดทศนิยมที่สอง
  // ควรใช้ `Math.round` หรือ `toFixed` กับการแปลงค่าในที่เดียว
  public calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);

    // คำนวณยอดรวมพร้อมภาษีและปัดเศษให้เหลือ 2 ตำแหน่งหลังจุดทศนิยม
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

  // ฟังก์ชันนี้ใช้ในการลดราคาสินค้า
  // ปัญหาที่อาจเกิดขึ้น: หากส่งค่า discountPercentage ที่ <= 0 หรือ > 100 มาจะไม่ทำการลดราคา
  // ควรตรวจสอบให้แน่ใจว่าเปอร์เซ็นต์การลดราคาอยู่ในช่วงที่เหมาะสม
  public applyDiscount(discountPercentage: number = 0): void {
    if (discountPercentage <= 0 || discountPercentage > 100) return;
    this.items.forEach((item) => {
      item.price *= 1 - discountPercentage / 100;
    });
  }
}

// ตัวอย่างการใช้งาน
const cart = new ShoppingCart();

// เพิ่มสินค้าลงในตะกร้า โดยที่ item รวม 'quantity' แล้ว
cart.addItem({ id: "1", name: "Laptop", price: 999.99, quantity: 1 });
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99, quantity: 2 });

console.log("Cart Summary (Before Discount):", cart.getCartSummary());

// ลดราคาสินค้า 10%
cart.applyDiscount(10);

console.log("Cart Summary (After Discount):", cart.getCartSummary());

// ลบ T-Shirt ออกจากตะกร้า
cart.removeItem("2");

console.log("Cart Summary (After Removing T-Shirt):", cart.getCartSummary());

// เพิ่ม T-Shirt กลับเข้าไปในตะกร้า
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99, quantity: 2 });
console.log("Cart Summary (After Adding T-Shirt Back):", cart.getCartSummary());

const subtotal = cart.calculateSubtotal();
console.log("Subtotal:", subtotal.toFixed(2));

const tax = cart.calculateTax(subtotal);
console.log("Tax:", tax.toFixed(2));

const total = cart.calculateTotal();
console.log("Total:", total.toFixed(2));
