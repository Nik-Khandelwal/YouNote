from django.shortcuts import render

def home(request):
	return render(request,'home.html')

def download(request,key):
	# int num = (3*key*key+2*key+1)%1000
	return render(request,'download.html',{'key':key})