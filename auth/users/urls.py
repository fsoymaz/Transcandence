from django.urls import path, include  # include fonksiyonunu ekledik
from .views import RegisterView, LoginView, UserView, LogoutView ,TwoFactor, TwoFactorActive
# from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user'),
    path('2fa/', TwoFactor.as_view(), name='2fa'),
    path('2faactive/', TwoFactorActive.as_view(), name='2faactive'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('two_factor/', include(tf_urls)),  # two_factor.urls içindeki tüm URL'leri 'two_factor/' altında grupluyoruz
]