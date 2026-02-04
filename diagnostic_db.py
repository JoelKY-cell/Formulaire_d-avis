import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Avis
from django.db import connection

print("=== DIAGNOSTIC BASE DE DONNÉES ===")

# Vérifier les colonnes de la table
with connection.cursor() as cursor:
    cursor.execute("PRAGMA table_info(api_avis);")
    columns = cursor.fetchall()
    print("\nColonnes dans la table api_avis:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")

# Vérifier les données
avis_count = Avis.objects.count()
print(f"\nNombre d'avis: {avis_count}")

if avis_count > 0:
    dernier_avis = Avis.objects.last()
    print(f"\nDernier avis (ID {dernier_avis.id}):")
    print(f"  - connu_facebook: {dernier_avis.connu_facebook}")
    print(f"  - connu_instagram: {dernier_avis.connu_instagram}")
    print(f"  - connu_tiktok: {dernier_avis.connu_tiktok}")
    print(f"  - connu_amis: {dernier_avis.connu_amis}")
    print(f"  - connu_autres: {dernier_avis.connu_autres}")
    print(f"  - connu_autres_precision: {dernier_avis.connu_autres_precision}")