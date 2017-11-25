### csv.exporter

Requirements: Needs redis and rethinkdb running

To build and run: 

```
docker build -t api .
docker run -p 4000:4000 -p 4567:4567 api
```

Without Docker:
```
cd app
npm install
pm2 start pm2.config.js 
or
node bin/server.js
```

Visit http://localhost:4567/dashboard to see the queues dashboard

Visit http://localhost:4000/redoc to see the API docs


