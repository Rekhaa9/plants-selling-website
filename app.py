from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__, static_folder='frontend', static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plants.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    category = db.Column(db.String(50))
    stock = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

# Routes
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/products')
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'image_url': product.image_url,
        'category': product.category,
        'stock': product.stock
    } for product in products])

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'image_url': product.image_url,
        'category': product.category,
        'stock': product.stock
    })

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description', ''),
        image_url=data.get('image_url', ''),
        category=data.get('category', ''),
        stock=data.get('stock', 0)
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product created successfully', 'id': new_product.id}), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    product.image_url = data.get('image_url', product.image_url)
    product.category = data.get('category', product.category)
    product.stock = data.get('stock', product.stock)
    
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})

# Initialize database
with app.app_context():
    db.create_all()
    
    # Add sample products if the database is empty
    if not Product.query.first():
        sample_products = [
            Product(
                name="Monstera Deliciosa",
                price=49.99,
                description="A popular tropical plant known for its large, glossy leaves with distinctive holes.",
                image_url="https://via.placeholder.com/300x300",
                category="Indoor Plants",
                stock=10
            ),
            Product(
                name="Snake Plant",
                price=29.99,
                description="A hardy plant that's perfect for beginners, known for its air-purifying qualities.",
                image_url="https://via.placeholder.com/300x300",
                category="Indoor Plants",
                stock=15
            ),
            Product(
                name="Aloe Vera",
                price=19.99,
                description="A succulent plant species known for its medicinal properties.",
                image_url="https://via.placeholder.com/300x300",
                category="Succulents",
                stock=20
            )
        ]
        db.session.add_all(sample_products)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True) 