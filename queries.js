// -------------------------------
// BASIC CRUD OPERATIONS
// -------------------------------

// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "The Great Gatsby" },
  { $set: { price: 15.99 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "Animal Farm" });


// -------------------------------
// ADVANCED QUERIES
// -------------------------------

// Books that are in stock AND published after 2010
db.books.find(
  {
    in_stock: true,
    published_year: { $gt: 2010 }
  }
);

// Projection: return only title, author, and price
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
);

// Sort by price ascending
db.books.find().sort({ price: 1 });

// Sort by price descending
db.books.find().sort({ price: -1 });

// Pagination: show page 2 (skip first 5)
db.books.find().skip(5).limit(5);


// -------------------------------
// AGGREGATION PIPELINES
// -------------------------------

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// Author with the highest number of books
db.books.aggregate([
  { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade
db.books.aggregate([
  {
    $group: {
      _id: {
        decade: {
          $subtract: ["$published_year", { $mod: ["$published_year", 10] }]
        }
      },
      count: { $sum: 1 }
    }
  }
]);


// -------------------------------
// INDEXING
// -------------------------------

// Create index on title
db.books.createIndex({ title: 1 });

// Create compound index: author + published year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to show performance improvement
db.books.find({ title: "1984" }).explain("executionStats");
