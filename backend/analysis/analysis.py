import pandas as pd
import matplotlib.pyplot as plt
import os

# Load raw data
df = pd.read_csv('./data/messy_6month_pakistan_retail_dataset.csv')

print(df.head())

# Count and Remove duplicate rows
df_count_duplicate = df.duplicated().sum()
print(f"Number of duplicate rows: {df_count_duplicate}")
df.drop_duplicates(inplace=True)
df_count_duplicate = df.duplicated().sum()
print(f"Number of duplicate rows after removal: {df_count_duplicate}")

# Check And Remove missing values
df_is_missing = df.isnull().sum()
print("Missing values in each column:")
print(df_is_missing)
df.dropna(inplace=True)

# Convert Unit_Price_PKR to numeric
df["Unit_Price_PKR"] = df["Unit_Price_PKR"].astype(str).str.replace("Rs", "").str.strip().astype(float, errors='ignore')

# Convert Total_Amount_PKR to numeric
df["Total_Amount_PKR"] = (
    df["Total_Amount_PKR"]
    .astype(str)
    .str.replace("Rs", "")
    .str.replace("PKR", "")
    .str.replace(".", "")
    .str.strip()
)
df["Total_Amount_PKR"] = pd.to_numeric(df["Total_Amount_PKR"], errors='coerce')
df.dropna(subset=["Total_Amount_PKR"], inplace=True)

# Clean City column
df["City"] = df["City"].str.strip().str.title()
df = df[df["City"] != "Nan"]

# 1: Total Revenue
total_revenue = df["Total_Amount_PKR"].sum()
print(f"Total Revenue of Six Months: RS {int(total_revenue):,}")

# 2: Top Selling City
city_sales = df.groupby("City")["Total_Amount_PKR"].sum()
print(f"\nTop Selling City: {city_sales.idxmax()} (Rs {int(city_sales.max()):,})")
print(f"Least Selling City: {city_sales.idxmin()} (Rs {int(city_sales.min()):,})")
print("\nCity Sales Ranking:")
print(city_sales.sort_values(ascending=False))

# 3: Customer Demographics
print("\n3.1 Gender Distribution:")
gender_count = df["Gender"].value_counts()
print(gender_count)

print("\n3.2 Customer Ratings:")
print(df["Customer_Rating"].value_counts().sort_index())

print("\n3.3 Payment Methods:")
print(df["Payment_Method"].value_counts())

# 4: Sales by Category
print("\n4. Product Category Sales:")
cat_sales = df.groupby("Product_Category")["Total_Amount_PKR"].sum().sort_values(ascending=False)
print(cat_sales)

# 5: Sales Chart
city_sales.sort_values(ascending=False).plot(kind="bar", figsize=(10, 5), color='#c8f55a')
plt.title("Sales by City")
plt.xlabel("City")
plt.ylabel("Revenue (PKR)")
plt.tight_layout()
os.makedirs('./charts', exist_ok=True)
plt.savefig('./charts/city_sales.png')
print("\nChart saved to ./charts/city_sales.png")

# Save cleaned data
os.makedirs('./cleaned', exist_ok=True)
df.to_csv('./cleaned/cleaned_sales_data.csv', index=False)
print("Cleaned data saved to ./cleaned/cleaned_sales_data.csv")
