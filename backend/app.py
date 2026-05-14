from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load and clean data
df = pd.read_csv('./cleaned/cleaned_sales_data.csv')

@app.route('/api/kpis')
def get_kpis():
    total_revenue = int(df['Total_Amount_PKR'].sum())
    total_orders = len(df)
    total_customers = int(df['Customer_ID'].nunique())
    avg_rating = round(df['Customer_Rating'].mean(), 1)
    return jsonify({
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'total_customers': total_customers,
        'avg_rating': avg_rating,
    })

@app.route('/api/city-revenue')
def get_city_revenue():
    city_sales = df.groupby('City')['Total_Amount_PKR'].sum().sort_values(ascending=False)
    return jsonify(city_sales.to_dict())

@app.route('/api/categories')
def get_categories():
    cat_sales = df.groupby('Product_Category')['Total_Amount_PKR'].sum().sort_values(ascending=False)
    return jsonify(cat_sales.to_dict())

@app.route('/api/payments')
def get_payments():
    payment_counts = df['Payment_Method'].value_counts()
    return jsonify(payment_counts.to_dict())

@app.route('/api/ratings')
def get_ratings():
    rating_counts = df['Customer_Rating'].value_counts().sort_index()
    return jsonify(rating_counts.to_dict())

@app.route('/api/delivery-status')
def get_delivery_status():
    status_counts = df['Delivery_Status'].value_counts()
    return jsonify(status_counts.to_dict())

@app.route('/api/gender')
def get_gender():
    gender_counts = df['Gender'].value_counts()
    return jsonify(gender_counts.to_dict())

@app.route('/api/top-city')
def get_top_city():
    city_sales = df.groupby('City')['Total_Amount_PKR'].sum()
    top = city_sales.idxmax()
    bottom = city_sales.idxmin()
    return jsonify({
        'top_city': top,
        'top_city_revenue': int(city_sales[top]),
        'least_city': bottom,
        'least_city_revenue': int(city_sales[bottom]),
    })

if __name__ == '__main__':
    print("Backend running at http://localhost:5000")
    app.run(debug=True, port=5000)
