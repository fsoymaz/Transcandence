from django.urls import path, include  # include fonksiyonunu ekledik
from .views import RegisterView, LoginView, UserView, LogoutView
# from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('two_factor/', include(tf_urls)),  # two_factor.urls içindeki tüm URL'leri 'two_factor/' altında grupluyoruz
]