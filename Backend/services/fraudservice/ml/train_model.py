import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

def preprocess_data(df):
    """
    Encode categorical variables for the model.
    Operation: CREDIT=0, DEBIT=1
    Transaction Type: DEPOSIT=0, WITHDRAWAL=1, TRANSFER=2
    """
    df = df.copy()
    df['operation_encoded'] = df['operation'].map({'CREDIT': 0, 'DEBIT': 1})
    df['type_encoded'] = df['transaction_type'].map({'DEPOSIT': 0, 'WITHDRAWAL': 1, 'TRANSFER': 2})
    
    # We drop the original string columns
    features = ['amount', 'operation_encoded', 'type_encoded', 'hour_of_day', 'day_of_week']
    return df[features]

def train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'training_data.csv')
    model_path = os.path.join(current_dir, 'isolation_forest.pkl')

    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Run generate_training_data.py first.")
        return

    print("Loading training data...")
    df = pd.read_csv(csv_path)
    
    print("Preprocessing data...")
    X = preprocess_data(df)

    print("Training Isolation Forest model...")
    # contamination=0.01 means we expect roughly 1% of transactions to be outliers/fraud
    model = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
    model.fit(X)

    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("Training complete!")

if __name__ == "__main__":
    train()
