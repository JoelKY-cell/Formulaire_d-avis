import os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import requests
from .models import Avis
from .serializers import AvisSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def hello_world(request):
    return Response({'message': 'Hello from Django API!'}, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def test_endpoint(request):
    if request.method == 'GET':
        return Response({'data': 'GET request successful'})
    elif request.method == 'POST':
        return Response({'data': 'POST request successful', 'received': request.data})

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
    except User.DoesNotExist:
        user = None
    
    if user:
        refresh = RefreshToken.for_user(user)
        role = 'superadmin' if user.is_superuser else 'admin' if user.is_staff else 'user'
        
        return Response({
            'message': 'Connexion réussie',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user.email,
            'role': role
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Identifiants incorrects'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_users(request, user_id=None):
    # Vérifier que l'utilisateur est superadmin
    if not request.user.is_superuser:
        return Response({'message': 'Accès refusé - SuperAdmin requis'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        users = User.objects.all().order_by('-date_joined')
        users_data = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'date_joined': user.date_joined
        } for user in users]
        return Response(users_data)
    
    elif request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        is_staff = request.data.get('is_staff', False)
        
        # Vérifier si l'email existe déjà
        if User.objects.filter(email=email).exists():
            return Response({'message': 'Un utilisateur avec cet email existe déjà'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=is_staff
        )
        return Response({'message': 'Utilisateur créé avec succès'}, status=status.HTTP_201_CREATED)
    
    elif request.method == 'PUT':
        try:
            user = User.objects.get(id=user_id)
            
            # Mettre à jour les champs fournis
            if 'username' in request.data:
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            if 'password' in request.data and request.data['password']:
                user.set_password(request.data['password'])
            if 'is_staff' in request.data:
                user.is_staff = request.data['is_staff']
            
            user.save()
            return Response({'message': 'Utilisateur modifié avec succès'})
        except User.DoesNotExist:
            return Response({'message': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE':
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'Utilisateur supprimé avec succès'})
        except User.DoesNotExist:
            return Response({'message': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_avis(request):
    avis_list = Avis.objects.all().order_by('-date_creation')
    serializer = AvisSerializer(avis_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_avis(request):
    serializer = AvisSerializer(data=request.data)
    if serializer.is_valid():
        avis = serializer.save()
        
        # Préparer l'email
        criteres = []
        if avis.qualite_service > 0:
            criteres.append(f'⭐ Qualité du service: {avis.qualite_service}/5')
        if avis.accueil_personnel > 0:
            criteres.append(f'🙋 Accueil du personnel: {avis.accueil_personnel}/5')
        if avis.rapidite > 0:
            criteres.append(f'⚡ Rapidité: {avis.rapidite}/5')
        if avis.rapport_qualite_prix > 0:
            criteres.append(f'💰 Rapport qualité/prix: {avis.rapport_qualite_prix}/5')
        if avis.satisfaction_globale > 0:
            criteres.append(f'😊 Satisfaction globale: {avis.satisfaction_globale}/5')
        
        criteres_text = '\n'.join(criteres) if criteres else 'Aucune évaluation donnée'
        
        # Calculer la moyenne des notes
        notes = [avis.qualite_service, avis.accueil_personnel, avis.rapidite, avis.rapport_qualite_prix, avis.satisfaction_globale]
        notes_donnees = [n for n in notes if n > 0]
        moyenne = sum(notes_donnees) / len(notes_donnees) if notes_donnees else 0
        
        # Comment a connu la boutique
        connu_par = []
        if hasattr(avis, 'connu_facebook') and avis.connu_facebook:
            connu_par.append('Facebook')
        if hasattr(avis, 'connu_instagram') and avis.connu_instagram:
            connu_par.append('Instagram')
        if hasattr(avis, 'connu_tiktok') and avis.connu_tiktok:
            connu_par.append('TikTok')
        if hasattr(avis, 'connu_amis') and avis.connu_amis:
            connu_par.append('Amis/Entourage')
        if hasattr(avis, 'connu_autres') and avis.connu_autres:
            precision = getattr(avis, 'connu_autres_precision', '') or ''
            autres_text = f"Autres ({precision})" if precision else "Autres"
            connu_par.append(autres_text)
        connu_text = ', '.join(connu_par) if connu_par else 'Non spécifié'
        
        email_content = f"""
NOUVEL AVIS CLIENT - {avis.date_creation.strftime('%d/%m/%Y à %H:%M')}

=== RÉSUMÉ ===
Note moyenne: {moyenne:.1f}/5 ({len(notes_donnees)} critères évalués)

=== DÉTAIL DES ÉVALUATIONS ===
{criteres_text}

=== COMMENT A CONNU LA BOUTIQUE ===
{connu_text}

=== SUGGESTIONS ===
{avis.suggestions or 'Aucune suggestion fournie'}

---
Cet avis a été envoyé depuis le formulaire de satisfaction client.
        """
        
        try:
            response = requests.post(
                'https://api.resend.com/emails',
                headers={
                    'Authorization': 'Bearer re_DiM9FjK4_2GrvGeTr7yYgwRWo8TLgmPQR',
                    'Content-Type': 'application/json'
                },
                json={
                    'from': 'onboarding@resend.dev',
                    'to': ['jky21239@gmail.com'],
                    'subject': 'Nouvel avis client',
                    'text': email_content
                },
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"Email envoyé avec succès: {response.status_code}")
                return Response({'message': 'Avis envoyé avec succès!'}, status=status.HTTP_201_CREATED)
            else:
                print(f"Erreur service email: {response.status_code} - {response.text}")
                raise Exception("Email service failed")
                
        except Exception as e:
            print(f"Erreur: {e}")
            print("\n" + "="*50)
            print("EMAIL POUR: joelkyras3@gmail.com")
            print("SUJET: Nouvel avis client")
            print("CONTENU:")
            print(email_content)
            print("="*50 + "\n")
            return Response({'message': 'Avis sauvegardé avec succès!'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)