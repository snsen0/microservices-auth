# Installation#

### Mikroservis desteği için
```
npm install @nestjs/microservices
```
# RabbitMQ (Api.Gateway file)
```
npm install @nestjs/microservices amqp-connection-manager amqplib
```

### Ortam değişkenleri yönetmek için
```
npm install @nestjs/config
```

### PostgreSQL (User.service file)
```
npm install @nestjs/typeorm typeorm pg
```

### Bcrypt
```
npm i bcrypt
```

### Token bazlı doğrulama için
```
npm install @nestjs/jwt jsonwebtoken
```

# Kimlik doğrulama için (NestJS içinde Passport.js kullanımını sağlar)
```
npm install @nestjs/passport
npm install passport-local
```

### JWT token’ını kontrol etmek için
```
npm install passport-jwt
```

### E-posta göndermek için
```
npm install nodemailer
```

### Swagger için
```
npm install @nestjs/swagger swagger-ui-express

```

### Veri doğrulama (validation) işlemleri için kullanılır. API'ye gelen isteklerin (POST, PUT vb.) içeriğini kontrol edip yanlış formatta olanları engellemek için gereklidir.
```
npm install class-validator class-transformer

```

---
_Hot Reload için uygulamayı bu şekilde başlatabilirsin_

```
npm run start:dev
```
---

#### Alt modül oluşturma
```
nest generate module dosya_adi
nest generate service dosya_adi
nest generate controller dosya_adi
```


