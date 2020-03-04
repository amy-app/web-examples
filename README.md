# web-examples

Example implementation of the AMY UI by using amy.app API

## Start webserver

To start the example project all you need to do is run a local webserver in the `examples` folder. For example: `npx serve`. This will serve your local project on port `5000`. Now you can open the example page via http://localhost:5000/vanilla or http://localhost:5000/react

## Get user token

So a user can interact with Amy the user needs a user Token. You can generate a user token via our API at https://learn.amy.app/__/api/ . Under point `Auth` you will find `generate-user-token`.
You will need three parameters: `oauth_consumer_key`, `api_key` and `user_id`.

The return value will be a JSON looking like this

```
{
    token: "long token string",
    amy_student_id: "Jaipuna_juhu_user1",
}
```

For fast testing you can use our example login data:

```
api_key: testKey
user_id: user123
```

This will generate the following api link https://learn.amy.app/__/api/auth/v1.0/generate-user-token?oauth_consumer_key=test1&api_key=testKey&user_id=user123 which will return a token
