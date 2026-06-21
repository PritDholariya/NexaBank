import pandas as pd
import numpy as np
import os
import random

def generate_data(num_samples=10000):
    np.random.seed(42)
    random.seed(42)

    # Base features
    # Amount: mostly small-medium transactions, clipped to avoid negatives
    amounts = np.random.normal(loc=200, scale=150, size=num_samples)
    amounts = np.clip(amounts, 1.0, 2000.0)

    # Operation: 60% CREDIT, 40% DEBIT
    operations = np.random.choice(['CREDIT', 'DEBIT'], size=num_samples, p=[0.6, 0.4])

    # Transaction Type
    txn_types = np.random.choice(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'], size=num_samples, p=[0.5, 0.3, 0.2])

    # Time features
    # Hour of day: peak around noon, less at night
    hours = np.random.normal(loc=13, scale=4, size=num_samples)
    hours = np.clip(hours, 0, 23).astype(int)

    # Day of week: 0=Mon, 6=Sun. Less on weekends.
    days = np.random.choice([0, 1, 2, 3, 4, 5, 6], size=num_samples, p=[0.18, 0.18, 0.18, 0.18, 0.18, 0.05, 0.05])

    df = pd.DataFrame({
        'amount': amounts,
        'operation': operations,
        'transaction_type': txn_types,
        'hour_of_day': hours,
        'day_of_week': days
    })

    # Add a few clear outliers (synthetic fraud) to the training data to ensure contamination
    # Although IsolationForest is unsupervised, having some extreme values helps it learn bounds
    outliers = pd.DataFrame({
        'amount': [9500.0, 8000.0, 15000.0, 9999.0, 12000.0],
        'operation': ['DEBIT', 'DEBIT', 'DEBIT', 'DEBIT', 'DEBIT'],
        'transaction_type': ['WITHDRAWAL', 'WITHDRAWAL', 'TRANSFER', 'WITHDRAWAL', 'TRANSFER'],
        'hour_of_day': [3, 2, 4, 1, 3], # Middle of the night
        'day_of_week': [6, 5, 6, 6, 5]  # Weekends
    })

    df = pd.concat([df, outliers], ignore_index=True)
    
    # Shuffle the dataset
    df = df.sample(frac=1).reset_index(drop=True)

    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'training_data.csv')
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} synthetic transactions and saved to {csv_path}")

if __name__ == "__main__":
    generate_data()
