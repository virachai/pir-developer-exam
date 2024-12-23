# โจทย์

จาก Class ShoppingCart นี้จงค้นหาและอธิบาย Bug ที่เกิดขึ้นอย่างละเอียด และให้ทำการแก้ไขโค๊ดในส่วนที่เป็น Bug ภายใน class นี้ให้ทำงานให้ถูกต้องนี้

## การวิเคราะห์และแก้ไข Bug ในคลาส `ShoppingCart`

### บทนำ

ในคลาส `ShoppingCart` ที่ให้มา มีปัญหากับเมธอด `addItem()` ที่ใช้ในการเพิ่มสินค้าลงในตะกร้า โดยเมธอดนี้รับพารามิเตอร์เป็น `Product` และ `quantity` ซึ่งเป็นจำนวนของสินค้าที่จะเพิ่มเข้าไป แต่มีข้อผิดพลาดในการใช้พารามิเตอร์ที่ไม่สอดคล้องกัน ทำให้เกิดปัญหาขึ้นเมื่อมีการเพิ่มหรืออัปเดตจำนวนสินค้าภายในตะกร้า

### การอธิบาย Bug

1. **การไม่ตรงกันของรูปแบบพารามิเตอร์ในเมธอด `addItem()`**:  
   เมธอด `addItem()` รับพารามิเตอร์ 2 ตัว คือ `item` ซึ่งเป็น `Product` และ `quantity` ซึ่งเป็นจำนวนของสินค้า (ประเภท `number`) แต่ในตัวอย่างการใช้งาน (Usage Example) กลับส่งอ็อบเจ็กต์ที่มีคุณสมบัติ `quantity` อยู่ภายในอ็อบเจ็กต์ของ `Product` เรียบร้อยแล้ว ซึ่งทำให้เกิดข้อผิดพลาดเมื่อเมธอด `addItem()` พยายามทำงานกับอ็อบเจ็กต์ที่ไม่ตรงกับที่คาดหวัง

2. **ความสับสนระหว่าง `Product` และ `CartItem`**:  
   ในโค้ด `Product` คือลักษณะของสินค้าพื้นฐานที่มีแค่ `id`, `name` และ `price` แต่ `CartItem` คือ `Product` ที่มีการขยายและเพิ่ม `quantity` เข้ามาด้วย เมธอด `addItem()` ต้องการแค่ `Product` และ `quantity` แยกจากกัน แต่ในตัวอย่างการใช้งาน (`Usage Example`) ส่งอ็อบเจ็กต์ที่เป็น `Product` พร้อม `quantity` ไป ซึ่งทำให้โค้ดทำงานไม่ถูกต้อง

3. **การจัดการสินค้าที่มีอยู่แล้วในตะกร้าไม่ถูกต้อง**:  
   เมธอด `addItem()` ใช้ `findIndex()` เพื่อหาตำแหน่งของสินค้าที่มีอยู่ในตะกร้าและเพิ่มจำนวนของสินค้านั้นเข้าไป แต่เมื่อ `quantity` ถูกส่งมาพร้อมกับ `Product` จะทำให้เกิดความสับสนในการจัดการสินค้าภายในตะกร้า

### วิธีการแก้ไข Bug

เพื่อแก้ไขปัญหานี้ เราสามารถทำการเปลี่ยนแปลงดังนี้:

1. **เปลี่ยนการรับพารามิเตอร์ของเมธอด `addItem()`**:  
   เปลี่ยนเมธอด `addItem()` ให้รับพารามิเตอร์เป็น `CartItem` ซึ่งมี `quantity` รวมอยู่แล้วในอ็อบเจ็กต์ ทำให้ไม่จำเป็นต้องแยก `Product` กับ `quantity` อีกต่อไป

2. **แก้ไขตัวอย่างการใช้งาน**:  
   ตัวอย่างการใช้งานต้องแก้ไขเพื่อให้สอดคล้องกับการรับพารามิเตอร์แบบใหม่ ซึ่งคือการส่ง `CartItem` ที่มี `quantity` อยู่ภายในอ็อบเจ็กต์แทนการส่ง `Product` กับ `quantity` แยกจากกัน

### โค้ดที่แก้ไขแล้ว

```typescript
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

  // เปลี่ยนเมธอดให้รับ CartItem ซึ่งมี quantity อยู่แล้ว
  public addItem(item: CartItem): void {
    const existingItemIndex = this.items.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      // หากสินค้ามีอยู่ในตะกร้าแล้ว ให้เพิ่มจำนวนสินค้า
      this.items[existingItemIndex].quantity += item.quantity;
    } else {
      // ถ้ายังไม่มีสินค้าในตะกร้า ให้เพิ่มสินค้าใหม่
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

    return Math.floor((subtotal + tax) * 100) / 100;
  }

  public getCartSummary(): string {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal();

    return `Subtotal: $${subtotal.toFixed(2)}, Tax: $${tax.toFixed(
      2
    )}, Total: $${total.toFixed(2)}`;
  }

  public applyDiscount(discountPercentage: number): void {
    this.items.forEach((item) => {
      item.price *= 1 - discountPercentage / 100;
    });
  }
}

// ตัวอย่างการใช้งานที่แก้ไขแล้ว
const cart = new ShoppingCart();

// ส่ง CartItem (ที่มี quantity อยู่แล้ว)
cart.addItem({ id: "1", name: "Laptop", price: 999.99, quantity: 1 });
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99, quantity: 2 });

console.log(cart.getCartSummary());

cart.applyDiscount(10); // ใช้ส่วนลด 10%
console.log(cart.getCartSummary());
```

### การเปลี่ยนแปลงที่ทำ

1. **ปรับเมธอด `addItem()`**:  
   เมธอด `addItem()` ถูกปรับให้รับพารามิเตอร์เป็น `CartItem` ซึ่งรวมถึง `quantity` และ `Product` ไปแล้ว ทำให้ไม่ต้องแยกพารามิเตอร์สองตัวออกจากกัน

2. **ปรับตัวอย่างการใช้งาน**:  
   ในตัวอย่างการใช้งานจะต้องส่งอ็อบเจ็กต์ที่มีคุณสมบัติครบถ้วนตามที่ `CartItem` คาดหวัง โดยส่ง `id`, `name`, `price`, และ `quantity` ครบถ้วน

### สรุปการแก้ไข:

- **Bug ในเมธอด `addItem()`**: เมธอดเดิมมีปัญหาการจัดการพารามิเตอร์ที่ไม่ตรงกัน ทำให้เกิดข้อผิดพลาดในการเพิ่มหรืออัปเดตจำนวนสินค้าภายในตะกร้า
- **แก้ไขการรับพารามิเตอร์ใน `addItem()`**: เปลี่ยนเมธอดให้รับ `CartItem` ซึ่งรวม `quantity` ไว้ในตัวอ็อบเจ็กต์
- **แก้ไขตัวอย่างการใช้งาน**: ตัวอย่างการใช้งานต้องส่งอ็อบเจ็กต์ที่มี `quantity` รวมอยู่ใน `CartItem` แทนการส่ง `Product` และ `quantity` แยกจากกัน

การแก้ไขนี้ทำให้โค้ดทำงานได้ถูกต้อง และลดความซับซ้อนในการจัดการข้อมูลสินค้าที่ถูกเพิ่มเข้าไปในตะกร้า

### โค้ดต้นฉบับ

```typescript
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

  public addItem(item: Product, quantity: number): void {
    const existingItemIndex = this.items.findIndex((i) => i.id === item.id);
    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({ ...item, quantity });
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

    return Math.floor((subtotal + tax) * 100) / 100;
  }

  public getCartSummary(): string {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal();

    return `Subtotal: $${subtotal.toFixed(2)}, Tax: $${tax.toFixed(
      2
    )}, Total: $${total.toFixed(2)}`;
  }

  public applyDiscount(discountPercentage: number): void {
    this.items.forEach((item) => {
      item.price *= 1 - discountPercentage / 100;
    });
  }
}

// Usage example
const cart = new ShoppingCart();

cart.addItem({ id: "1", name: "Laptop", price: 999.99, quantity: 1 });
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99, quantity: 2 });

console.log(cart.getCartSummary());

cart.applyDiscount(10); // Apply 10% discount
console.log(cart.getCartSummary());
```
