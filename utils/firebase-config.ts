import admin from 'firebase-admin';

const serviceAccount: any = {
  type: 'service_account',
  project_id: 'ztellar-11a4f',
  private_key_id: '86eda7a2e20f0481b4fb966ca1055c8f65f49a1d',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDxHcZmhJRcD53C\nbJewb+LndIE3ljemCsBhdQGWLafDyPS1IT+fhU3yidLc+mdVuGb3z0dyDaNS4+8E\nhVWWQWDKWTc0AEudN/zPwv2EjSxIrz0kIdWJ3HQhfYRej6zIo96Ex5SklJH8NJ+A\n7WNsQ3wODiKGKfOzLWodkU15wvuI0/aDl6CQU9RCICGAqSvuE8sLNoXPdTW9ptk9\nuHzPlj2XySV4jLBGi9U3l5W2cUOArf/ZmkUYPjaZgbPau1dN46ddlIPqB9j/Slb/\nTjXPo1nfyQoHMO7jTK1hLW/8of7fNQFTuRAWBAbXv+EARFozg9PV0XsSzYF/c1j5\nFNE2BqBhAgMBAAECggEAc+yh1+ZEQiLL8Y8uOwkAKdHM0oHpjW474l9T/PVEZJA4\nfuFWaoa33DVBaTcG+aKn9tr0ebRu4sptv1mvtYcHVyIftWOy9wrVBLq2EsWhFe0S\n001lElwohXWIb8JaCzkmIeam453+tihCy8TWeVXUzhkjpieDYJEkJMUYX8NMFhML\n2fSytOKIRzZp2ZBTqwEXS/CeTR+reOK37f9hz22+UxnEnpjCvmATlmd+dnQ4hoJG\nNumBvgIOEbmjvuXvpAcoKO/SPQ3t/1NywQ0oqx/NlQDmV6fagHHTbopRvfDOGqXm\nCqq5cRlHAY2xXKR41hTXKhAJkdXQVMS+4APoMfroJQKBgQD5tpbuc0Tq3EF32uAO\nXYJG5NIelUvzHQlmq1L3ZflJIGQtJfXYmuReFMSiuX/Ikgr+zAepskCiUzqgtyR0\nMgGAfQvwPtVar4I+LlPa1MlYkdUitBqK1DxZ4v/QbGlFQXJU8oA6mxRJCOiqlcfg\niZE1WBtMPowTRPCCnL2EqwlhowKBgQD3L8cktQczOH78dFAnU++fKgp2FMejOaIl\nJWjpIt3+sEADYJfSodMk1Exp+WMi4yypmxL2l/Nj5u3QOmG08/f0+YJFSodUqZzG\njNAPiC8z4+XJy4afqLC7fE/CxgbbA1fUFJV+q21AGLAsm1VDATek7TRrNnBjyJxe\nMNXQhVd+KwKBgFtgs46CY9/FxbdEQuU+1qN2rGVAoNBP+da2LuAVUsmtrrrOv04K\nMDM1Sld5pgcRWjCvHMa+UeSUrEmPeymB+wa3u5yogY5z1ydF8K2NXDiq9OGEIopW\n69bAuHfelA8hyeLH8qB/i0bGmc2Cjefer2Jj4WlfIgcTHSfOj5NyuzYdAoGASS+w\nOsIOm6/CiWS2xq4naGy+JDAK290YkP7+jOhx6hKtIVLcINUg+uqQpV/dZlr0wlLT\nzoc23QFmsBxZCYaih7nIRFPItdxyOqc+gxrDPw3e31yPQ35itWAdDYIsTXQz8OsX\nSCXhdvTYVJy5JdmabA5/Uq8Pn7up8IltBQw113kCgYAo3uEuicsAe3sMP6NgiF+u\nR9vedDWyIqpCF5A7ITgylHjMYLasYdnhHYLWKS5Yz3hJi6Mh6pOUAmaXbP1tWX3S\nPHfUbVJXEeQsu0kkr0QDMcyoBdD2xgNXw1Hauj+g2KDizxit/depsgG+XGZm036N\n5t5bTgFDAII5+pnAdrUQsA==\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-zlxne@ztellar-11a4f.iam.gserviceaccount.com',
  client_id: '113970458885196097368',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zlxne%40ztellar-11a4f.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://ztellar-11a4f.appspot.com',
});

export const bucket = admin.storage().bucket();
