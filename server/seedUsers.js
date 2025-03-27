import { usersCol } from './config/firebaseDB.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  try {
    // Delete existing test users if they exist
    const emails = ['admintest@gmail.com', 'sellertest@gmail.com', 'buyertest@gmail.com'];
    const snapshot = await usersCol.where('email', 'in', emails).get();
    
    const batch = usersCol.firestore.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Create test users with proper hashed passwords
    const users = [
      {
        name: "Admin User",
        email: "admintest@gmail.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        name: "Test Seller",
        email: "sellertest@gmail.com",
        password: await bcrypt.hash("seller123", 10),
        role: "seller",
        createdAt: new Date().toISOString()
      },
      {
        name: "Test Buyer",
        email: "buyertest@gmail.com",
        password: await bcrypt.hash("buyer123", 10),
        role: "buyer",
        createdAt: new Date().toISOString()
      }
    ];

    for (const user of users) {
      await usersCol.add(user);
    }

    console.log('✅ Test users created successfully!');
    console.log('Admin: admintest@gmail.com / admin123');
    console.log('Seller: sellertest@gmail.com / seller123');
    console.log('Buyer: buyertest@gmail.com / buyer123');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    process.exit();
  }
};

seedUsers();