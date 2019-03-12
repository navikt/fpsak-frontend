Konfig er skreddersydd til openam hos NAV i fagsystemsonen.



### Redis
```bash
docker stop redis; docker rm redis; docker run --name redis -p 6379:6379 -d redis
```

### TODO 
* Lage dette om til et baseimage for gjenbrukbarhet.
* Gjøre app-dynamics til en del av baseimage.
* Legge til "fail fast" slik at imaget ikke laster om redis eller noe annet er feil.
