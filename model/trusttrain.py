import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# === Load and prepare data ===
df = pd.read_csv("friendship_intensity.csv")
df = df.drop(columns=['screen_name'])

# === Normalize features ===
scaler_raw = StandardScaler()
X_scaled = scaler_raw.fit_transform(df)

# === PCA for importance weights ===
pca = PCA(n_components=1)
pca.fit(X_scaled)
features = df.columns
importance = pd.Series(abs(pca.components_[0]), index=features)
importance /= importance.sum()
importance.sort_values(ascending=False, inplace=True)

# === Select features up to 'friends_count' ===
filtered_importance = importance.loc[:'friends_count']
filtered_features = filtered_importance.index.tolist()

# === Apply weights to selected features ===
weighted_df = df[filtered_features].copy()
for col in weighted_df.columns:
    weighted_df[col] *= filtered_importance[col]

# === Scale weighted data ===
scaler = StandardScaler()
X_final = scaler.fit_transform(weighted_df)

# === KMeans clustering (3 classes) ===
kmeans = KMeans(n_clusters=3, random_state=42)
df['cluster'] = kmeans.fit_predict(X_final)
df['cluster_label'] = df['cluster'].map({0: 'Trusted', 1: 'Average', 2: 'Untrusted'})

# === Train-test split ===
X = X_final
y = df['cluster_label']

# === Decision Tree Classifier ===
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import xgboost as xgb
import joblib
import pandas as pd

# === Apply feature weights ===
weighted_df_xgb = df[filtered_features].copy()
for col in weighted_df_xgb.columns:
    weighted_df_xgb[col] *= filtered_importance[col]

# === Standardize data ===
scaler_xgb = StandardScaler()
X_xgb = scaler_xgb.fit_transform(weighted_df_xgb)

# === Encode labels ===
le = LabelEncoder()
y_encoded = le.fit_transform(df['cluster_label'])

# === Train-test split ===
X_train, X_test, y_train, y_test = train_test_split(X_xgb, y_encoded, test_size=0.2, random_state=42)

# === Train XGBoost Classifier ===
xgb_clf = xgb.XGBClassifier(
    n_estimators=10,
    max_depth=4,
    use_label_encoder=False,
    eval_metric='mlogloss',
    random_state=42
)
xgb_clf.fit(X_train, y_train)

# === Evaluate model ===
y_pred = xgb_clf.predict(X_test)
print("\n[XGBoost Classifier Report]\n", classification_report(y_test, y_pred, target_names=le.classes_))

# === Save XGBoost model and label encoder ===
joblib.dump(xgb_clf, "xgb_classifier_model.joblib")
joblib.dump(scaler_xgb, "scaler_xgb.joblib")
joblib.dump(le, "label_encoder.joblib")
print("✅ XGBoost model and metadata saved.")

