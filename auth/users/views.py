from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from django.http import HttpResponse
from .models import User
import jwt, datetime
import qrcode, pyotp, string, random


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully'}, status=201)
        return Response(serializer.errors, status=400)
    
class TwoFactorActive(APIView):
    def post(self, request):
        username = request.data.get('username')
        _bool = request.data.get('twofactoractive')

        if _bool is None:
            return Response({'error': 'Please provide the twofactoractive status'}, status=400)

        user = User.objects.filter(username=username).first()
        if user is None:
            raise AuthenticationFailed("User not found!")

        user.twofactoractive = bool(_bool)
        user.save()

        return Response({'message': 'User updated successfully'}, status=200)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Please provide both email and password'}, status=400)

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("User not found!")

        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password!")

        payload = {
            'id': user.id,
            'email': user.email,
			'username': user.username,
            'twofactoractive': user.twofactoractive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=False)
        response.data = {
            'token': token
        }
        return response
    
class TwoFactor(APIView):
    def post(self, request):
        userCode = request.data.get('userCode')
        username = request.data.get('username')
        user = User.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed("User not found!")

        totp = pyotp.TOTP(user.twofactorkey)
        if totp.verify(userCode):
            payload = {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1),
                'iat': datetime.datetime.utcnow()
            }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'token': token
            }
            return response
        else:
            return Response({'error': 'Invalid TOTP code'}, status=400)

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt') 
        response.data = {
            'message': 'success'
        }
        return response
    
def home(request):
    return HttpResponse("Welcome to the home page!")
